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
      // loading: false,
    };

    // bind functions
    this.fetchImages = this.fetchImages.bind(this);
    this.fetchImage = this.fetchImage.bind(this);
    this.sendSelection = this.sendSelection.bind(this);
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
    this.onSkipClick = this.onSkipClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.endTutorial = this.endTutorial.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.generateImages = this.generateImages.bind(this);
    this.getBatchSize = this.getBatchSize.bind(this);
  }

    componentDidMount() {
    // When the app loads,get the batch size and then get all the image urls from flask.
    this.getBatchSize();
    // this.getTotalBatchSize();
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

  

  fetchImage() {
    // Collect one image url from flask
    axios
      .get("/image")
      .then((res) => {
        if (res.data.image == "none")
          this.setState({
            view: "end",
          });
        else
          this.setState(
            {
              image: res.data.image,
            },
            () => {
              this.getBatchSize();
            }
          );
      })
      .catch((err) => console.log("ERROR: ", err));
  }

  fetchImages() {
    // Collect the list of image urls to request one by one later.

    fetch("/images/" + this.state.index)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          images: data.images,
          batch_size: data.images.length,
          index: 0,
          loading: false,
        });
        if (!data.images.length)
          this.setState({
            view: "end",
          });
      });
    }
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
    this.setState({
      batch_size: this.state.batch_size - 1,
      index: this.state.index + 1,
    });
    this.sendSelection(1);
    this.fetchImage();
  }

  onSkipClick() {
    // Send no label to flask, mark as ambigous with constant value 10
    // and update the index so the next image will show.
    this.setState({
      batch_size: this.state.batch_size - 1,
      index: this.state.index + 1,
    });
    this.sendSelection(2);
    this.fetchImage();
  }

  onRejectClick() {
    // Send the negative label to flask,
    // and update the index so the next image will show.
    this.setState({
      batch_size: this.state.batch_size - 1,
      index: this.state.index + 1,
    });
    this.sendSelection(0);
    this.fetchImage();
  }

  onBackClick() {
    this.setState({
      batch_size: this.state.batch_size + 1,
      index: this.state.index - 1,
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
          total_batch_size={this.state.total_batch_size}
          batch_size={this.state.batch_size}
          image={this.state.image}
          onAcceptClick={this.onAcceptClick}
          onRejectClick={this.onRejectClick}
          onSkipClick={this.onSkipClick}
          onBackClick={this.onBackClick}
          time={this.state.time}
        />
      ) : (
        <Button loading={true} />
      );
    else if (this.state.view === "end") body = <EndScreen />;
    return <div className="App">{body}</div>;
  }
}
