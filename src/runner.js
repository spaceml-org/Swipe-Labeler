import React, { useEffect } from "react";
import "./styles.css";
import { Button } from "@blueprintjs/core";
import { SwipeScreen } from "./components/swipescreen";
import { TutorialScreen } from "./components/tutorialscreen";
import { EndScreen } from "./components/endscreen";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import axios from "axios";

function hasSeenTutorial() {
  // Checks for a cookie on the users computer that will tell the user has already done the tutorial.
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("hasSeenTutorial="));
}

function setTutorialSeen() {
  document.cookie = "hasSeenTutorial=true";
}

export default class App extends React.Component {
  // Main component
  constructor(props) {
    super(props);
    this.state = {
      view: hasSeenTutorial() ? "active" : "tutorial",
      index: 0,
      image: null,
      total_batch_size: null,
      batch_size: null,
      imgUrls: [],
      undoUrls: [],
      // curr_image_url: "none",
      undoHappened: true,
      noOfSwipes: 0,
      batchStop: 5,
      leftBehind: 0,
      // swipes: 1,
      // loading: false,
    };

    // bind functions
    this.fetchImage = this.fetchImage.bind(this);
    this.sendSelection = this.sendSelection.bind(this);
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
    this.onSkipClick = this.onSkipClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.endTutorial = this.endTutorial.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.getBatchSize = this.getBatchSize.bind(this);
  }

  componentDidMount() {
    // When the app loads,get the batch size and then get all the image urls from flask.
    // this.getBatchSize();
    this.getTotalBatchSize();
    this.fetchImage();
  }

  getTotalBatchSize() {
    axios
      .get("/getsize")
      .then((res) => {
        console.log("response = ", res.data.batch_size);
        this.setState(
          {
            total_batch_size: res.data.batch_size,
          },
          () => {
            console.log("got total batch state as: ", this.state.batch_size);
          }
        );
      })
      .catch((err) => console.log("ERROR: ", err));
  }

  getBatchSize() {
    axios
      .get("/getsize")
      .then((res) => {
        console.log("response = ", res.data.batch_size);
        this.setState(
          {
            batch_size: res.data.batch_size,
          },
          () => {
            console.log("got total batch state as: ", this.state.batch_size);
          }
        );
      })
      .catch((err) => console.log("ERROR: ", err));
  }

  fetchImage() {
    // Collect one image url from flask
    let url;
    if (this.state.leftBehind != 0) {
      url = this.state.undoUrls.pop();
      this.setState({
        leftBehind: this.state.leftBehind - 1,
      });
    } else url = "none";
    axios
      .post("/image", {
        swipes: this.state.swipes + 1 || 0,
        image_url: url || "none",
      })
      .then((res) => {
        if (res.data.image === "none")
          this.setState({
            view: "end",
          });
        else {
          let x = this.state.imgUrls;
          //check if res.data.image is in x before pushing to x
          x.push(res.data.image);
          let url = this.state.imgUrls[this.state.index]
            ? this.state.imgUrls[this.state.index]
            : "none";
          let s = this.state.noOfSwipes + this.state.leftBehind;
          this.setState(
            {
              image: res.data.image,
              imgUrls: x,
              curr_image_url: url,
              swipes: s,
              // siwpes: s,
            },
            () => {
              console.log("img ", typeof this.state.image);
              this.getBatchSize();
            }
          );
        }
      })
      .catch((err) => console.log("ERROR: ", err));
  }

  setLoading(s) {
    console.log("reached ");
    this.setState({
      loading: s,
    });
  }

  sendSelection(value) {
    // When the user swipes, clicks, or presses a choice (accept or reject),
    // that choice gets sent to flask.
    fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: this.state.image,
        value: value,
      }),
    });
  }

  onAcceptClick() {
    // Send the positive label to flask, make call to /image to get the next image from flask
    // and update the index so the next image will show.
    this.setState(
      {
        // batch_size: this.state.batch_size - 1,
        index: this.state.index + 1,
        noOfSwipes: this.state.noOfSwipes + 1,
        swipes: this.state.noOfSwipes + this.state.leftBehind,
        undoHappened: false,
      },
      () => {
        this.sendSelection(1);
        if (this.state.noOfSwipes === this.state.batchStop)
          this.setState({
            view: "end",
          });
        else this.fetchImage();
      }
    );
  }

  onSkipClick() {
    // Send no label to flask, mark as ambigous with constant value 10
    // and update the index so the next image will show.
    this.setState(
      {
        // batch_size: this.state.batch_size - 1,
        index: this.state.index + 1,
        noOfSwipes: this.state.noOfSwipes + 1,
        swipes: this.state.noOfSwipes + this.state.leftBehind,
        undoHappened: false,
      },
      () => {
        this.sendSelection(2);
        if (this.state.noOfSwipes === this.state.batchStop)
          this.setState({
            view: "end",
          });
        else this.fetchImage();
      }
    );
  }

  onRejectClick() {
    // Send the negative label to flask,
    // and update the index so the next image will show.
    this.setState(
      {
        // batch_size: this.state.batch_size - 1,
        index: this.state.index + 1,
        noOfSwipes: this.state.noOfSwipes + 1,
        swipes: this.state.noOfSwipes + this.state.leftBehind,
        undoHappened: false,
      },
      () => {
        this.sendSelection(0);
        if (this.state.noOfSwipes === this.state.batchStop)
          this.setState({
            view: "end",
          });
        else this.fetchImage();
      }
    );
  }

  onBackClick() {
    // current image = this.state.imgUrls[this.state.index]
    // console.log("Request: ", this.state.imgUrls[this.state.index - 1]);
    // add the image which is going to be undone to url stack and request the same image from flask
    let x = this.state.imgUrls;
    let y = this.state.undoUrls;
    x.push(this.state.imgUrls[this.state.index - 1]);
    y.push(this.state.imgUrls[this.state.index]);
    axios
      .post("/undo", {
        image_url: this.state.imgUrls[this.state.index - 1],
        curr_image_url: this.state.imgUrls[this.state.index],
      })
      .then((res) => {
        console.log(res);
        this.setState({
          // batch_size: this.state.batch_size + 1,
          index: this.state.index + 1,
          image: this.state.imgUrls[this.state.index - 1],
          imgUrls: x,
          undoUrls: y,
          noOfSwipes: this.state.noOfSwipes - 1,
          leftBehind: this.state.leftBehind + 1,
          undoHappened: true,
        });
      })
      .catch((err) => console.log("ERROR: ", err));
  }

  endTutorial() {
    this.setState({
      view: "active",
    });
    // Set a cookie on the user's browser so they don't see the tutorial again.
    setTutorialSeen();
  }

  render() {
    // this.getBatchSize();
    var body = null;
    {
      console.log("Parent Props\n", this.state.images);
    }
    if (this.state.view === "tutorial")
      body = <TutorialScreen end={this.endTutorial} />;
    else if (this.state.view === "active")
      body = this.state.image ? (
        <SwipeScreen
          index={this.state.index}
          undoHappened={this.state.undoHappened}
          total_batch_size={this.state.total_batch_size}
          // imgUrls={this.state.imgUrls}
          // index={this.state.index}
          batch_size={this.state.batch_size}
          image={this.state.image}
          onAcceptClick={this.onAcceptClick}
          onRejectClick={this.onRejectClick}
          onSkipClick={this.onSkipClick}
          onBackClick={this.onBackClick}
          time={this.state.time}
          batchStop={this.state.batchStop}
          noOfSwipes={this.state.noOfSwipes}
        />
      ) : (
        <Button loading={true} />
      );
    else if (this.state.view === "end") {
      if (this.state.batch_size <= 0) body = <EndScreen />;
      else body = <EndScreen continue={true} />;
    }
    return <div className="App">{body}</div>;
  }
}
