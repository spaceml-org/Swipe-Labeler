import React from "react";
import "./styles.css";
import { Button } from "@blueprintjs/core";
import { SwipeScreen } from "./components/swipescreen";
import { TutorialScreen } from "./components/tutorialscreen";
import { EndScreen } from "./components/endscreen";
import { Welcome } from "./components/welcomescreen";
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
  console.log("tutorial will be set to seen!");
  document.cookie = "hasSeenTutorial=true";
}

export default class App extends React.Component {
  // Main component
  constructor(props) {
    super(props);
    this.state = {
      view: hasSeenTutorial() ? "active" : "welcome",
      // view: "welcome",
      index: 0,
      image: null,
      total_batch_size: null,
      batch_size: null,
      imgUrls: [],
      undoUrls: [],
      undoHappened: true,
      swipes: 0,
      noOfSwipes: 0,
      batchStop: 0,
      leftBehind: 0,
      labeledSize: 0,
      progWidth: 0,
      displayProg: "prog-bar",
    };

    // bind functions
    this.fetchImage = this.fetchImage.bind(this);
    this.sendSelection = this.sendSelection.bind(this);
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
    this.onSkipClick = this.onSkipClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onQuitClick = this.onQuitClick.bind(this);
    this.endTutorial = this.endTutorial.bind(this);
    this.startTutorial = this.startTutorial.bind(this);
    this.startLabel = this.startLabel.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.getBatchSize = this.getBatchSize.bind(this);
    this.decideProgWidth = this.decideProgWidth.bind(this);
  }

  componentDidMount() {
    // When the app loads,get the batch size and 1 image url from flask.

    //refresh handler - to copy the images back to unlabeled incase user hits refresh
    if (window.performance) {
      if (performance.navigation.type === 1) {
        //Send the current image to unlabeled
        // If undo stack has a url, send that as well to unlabeled
        let image_url = sessionStorage.getItem("url");
        let curr_image_url = sessionStorage.getItem("undo-url");
        if (curr_image_url === image_url) {
          curr_image_url = "none";
        }
        console.log("Image url: ", image_url);
        console.log("Curr_Image url: ", curr_image_url);

        axios
          .post("/refresh", {
            image_url: image_url,
            curr_image_url: curr_image_url,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log("ERROR: ", err));
      }
    }

    let x = parseInt(sessionStorage.getItem("noOfSwipes"));
    if (!x) x = 0;
    this.setState({
      noOfSwipes: x,
    });

    this.getTotalBatchSize();
    this.fetchImage();
  }

  componentDidUpdate() {
    if (this.state.view === "end") {
      //change session storage before moving to endscreen
      console.log("reached end");
      sessionStorage.setItem(`noOfSwipes`, 0);
    } else {
      // load the current image onto session storage, to be moved later incase user hits refresh
      sessionStorage.setItem(`undo-url`, this.state.curr_image_url);
      sessionStorage.setItem(`url`, this.state.image);
      sessionStorage.setItem(`noOfSwipes`, this.state.noOfSwipes);
    }
  }

  getTotalBatchSize() {
    axios
      .get("/getsize")
      .then((res) => {
        console.log("response = ", res.data.batch_size);
        this.setState(
          {
            total_batch_size: res.data.batch_size,
            batchStop: res.data.batch_stop,
            imagesLeft: res.data.batch_stop - 1,
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
            labeledSize: res.data.labeled_size,
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
    if (this.state.leftBehind !== 0) {
      url = this.state.undoUrls.pop();
      this.setState({
        leftBehind: this.state.leftBehind - 1,
      });
    } else url = "none";
    axios
      .post("/image", {
        swipes: this.state.swipes + 1,
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

  decideProgWidth() {
    if (this.state.batchStop > this.state.total_batch_size) {
      console.log("reached block");
      this.setState({
        displayProg: "prog-bar",
        msg: "reached!",
      });
      this.setState(
        {
          progWidth: this.state.noOfSwipes / (this.state.batch_size + 1),
          msg: " reach",
        },
        () => {
          console.log(this.state.msg);
        }
      );
    } else {
      let x = this.state.batchStop;
      this.setState(
        {
          progWidth: this.state.noOfSwipes / this.state.batchStop,
          msg: "didnt reach",
        },
        () => {
          console.log(this.state.msg);
        }
      );
    }
  }

  onAcceptClick() {
    // Send the positive label to flask, make call to /image to get the next image from flask
    // and update the index so the next image will show.
    this.setState(
      {
        index: this.state.index + 1,
        noOfSwipes: this.state.noOfSwipes + 1,
        swipes: this.state.noOfSwipes + this.state.leftBehind,
        undoHappened: false,
        imagesLeft: this.state.imagesLeft - 1,
      },
      () => {
        this.sendSelection(1);
        this.decideProgWidth();
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
        index: this.state.index + 1,
        noOfSwipes: this.state.noOfSwipes + 1,
        swipes: this.state.noOfSwipes + this.state.leftBehind,
        undoHappened: false,
        imagesLeft: this.state.imagesLeft - 1,
      },
      () => {
        this.sendSelection(2);
        this.decideProgWidth();
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
        index: this.state.index + 1,
        noOfSwipes: this.state.noOfSwipes + 1,
        swipes: this.state.noOfSwipes + this.state.leftBehind,
        undoHappened: false,
        imagesLeft: this.state.imagesLeft - 1,
      },
      () => {
        this.sendSelection(0);
        this.decideProgWidth();
        if (this.state.noOfSwipes === this.state.batchStop)
          this.setState({
            view: "end",
          });
        else this.fetchImage();
      }
    );
  }

  onBackClick() {
    // add the image which is going to be undone to url stack and request the same image from flask
    let x = this.state.imgUrls;
    let y = this.state.undoUrls;
    x.push(this.state.imgUrls[this.state.index - 1]);
    y.push(this.state.imgUrls[this.state.index]);
    axios
      .post("/undo", {
        image_url: this.state.imgUrls[this.state.index - 1],
      })
      .then((res) => {
        console.log(res);
        this.setState(
          {
            index: this.state.index + 1,
            image: this.state.imgUrls[this.state.index - 1],
            imgUrls: x,
            undoUrls: y,
            noOfSwipes: this.state.noOfSwipes - 1,
            leftBehind: this.state.leftBehind + 1,
            undoHappened: true,
            imagesLeft: this.state.imagesLeft + 1,
          },
          () => {
            this.decideProgWidth();
          }
        );
      })
      .catch((err) => console.log("ERROR: ", err));
  }

  onQuitClick() {
    //Send the current image to unlabeled
    // If undo stack has a url, send that as well to unlabeled
    let image_url, curr_image_url;
    if (this.state.undoHappened && this.state.index) {
      image_url = this.state.image;
      curr_image_url = this.state.undoUrls[0];
    } else {
      image_url = this.state.curr_image_url;
      curr_image_url = "none";
    }

    axios
      .post("/quit", {
        image_url: image_url,
        curr_image_url: curr_image_url,
      })
      .then((res) => {
        console.log(res);
        this.setState({
          view: "end",
        });
      })
      .catch((err) => console.log("ERROR: ", err));
  }

  startTutorial() {
    console.log("hello world from start");
    this.setState({
      view: "tutorial",
    });
  }

  startLabel() {
    this.setState({
      view: "active",
    });
  }

  endTutorial() {
    this.setState({
      view: "active",
    });
    // Set a cookie on the user's browser so they don't see the tutorial again.
    setTutorialSeen();
  }

  render() {
    var body = null;
    {
      console.log("Parent state\n", this.state.images);
    }
    let toContinue;
    if (this.state.batch_size <= 0) toContinue = false;
    else toContinue = true;

    let displayProg;
    if (this.state.batchStop > this.state.total_batch_size) {
      console.log("reached if block!");
      displayProg = "prg-bar";
      // displayProg = "prog-bar";
    } else {
      displayProg = "prog-bar";
    }
    if (this.state.view === "welcome")
      body = (
        <Welcome
          startTutorial={this.startTutorial}
          startLabel={this.startLabel}
        />
      );
    else if (this.state.view === "tutorial")
      body = <TutorialScreen end={this.endTutorial} />;
    else if (this.state.view === "active")
      body = this.state.image ? (
        <SwipeScreen
          index={this.state.index}
          undoHappened={this.state.undoHappened}
          total_batch_size={this.state.total_batch_size}
          swipes={this.state.swipes}
          batch_size={this.state.batch_size}
          labeledSize={this.state.labeledSize}
          image={this.state.image}
          onAcceptClick={this.onAcceptClick}
          onRejectClick={this.onRejectClick}
          onSkipClick={this.onSkipClick}
          onBackClick={this.onBackClick}
          onQuitClick={this.onQuitClick}
          time={this.state.time}
          batchStop={this.state.batchStop}
          noOfSwipes={this.state.noOfSwipes}
          imagesLeft={this.state.imagesLeft}
          progWidth={this.state.progWidth}
          displayProg={displayProg}
        />
      ) : (
        <Button loading={true} />
      );
    else if (this.state.view === "end") {
      // body = <EndScreen continue={toContinue} />;
      if (this.state.batch_size - 1 <= 0)
        body = <EndScreen setTutorialSeen={setTutorialSeen} />;
      else
        body = (
          <EndScreen continue={toContinue} setTutorialSeen={setTutorialSeen} />
        );
    }
    return <div className="App">{body}</div>;
  }
}
