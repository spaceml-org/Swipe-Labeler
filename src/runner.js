import React, { useEffect } from "react";
import "./styles.css";
import moon from "./tutorial-images/moon.jpg";
import flag from "./tutorial-images/flag.jpg";
import earthrise from "./tutorial-images/earthrise.jpg";
import astronaut from "./tutorial-images/astronaut.jpg";
import TinderCard from "react-tinder-card";
import { Button, ProgressBar } from "@blueprintjs/core";
import { SwipeScreen } from "./components/swipescreen";
import { TutorialScreen } from "./components/tutorialscreen";
import { EndScreen } from "./components/endscreen";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
// import { Magnifier, GlassMagnifier,SideBySideMagnifier,PictureInPictureMagnifier,MOUSE_ACTIVATION,TOUCH_ACTIVATION
// } from "react-image-magnifiers";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
      images: null,
      batch_size: null,
    };

    // bind functions
    this.fetchImages = this.fetchImages.bind(this);
    this.sendSelection = this.sendSelection.bind(this);
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
    this.onSkipClick = this.onSkipClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.endTutorial = this.endTutorial.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // When the index gets updated, show the next image.
    if (
      prevState.index !== this.state.index &&
      this.state.index === this.state.batch_size
    )
      this.fetchImages();
  }

  componentDidMount() {
    // When the app loads, get all the image urls from flask.
    this.fetchImages();
  }

  fetchImages() {
    // Collect the list of image urls to request one by one later.
    fetch("/images")
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          images: data.images,
          batch_size: data.images.length,
          index: 0,
        });
        if (!data.images.length)
          this.setState({
            view: "end",
          });
      });
  }

  sendSelection(value) {
    // When the user swipes, clicks, or presses a choice (accept or reject),
    // that choice gets sent to flask.
    fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: this.state.images[this.state.index],
        value: value,
      }),
    });
  }

  onAcceptClick() {
    // Send the positive label to flask,
    // and update the index so the next image will show.
    this.sendSelection(1);
    this.setState({
      index: this.state.index + 1,
    });
  }

  onSkipClick() {
    // Send no label to flask, mark as ambigous with constant value 10
    // and update the index so the next image will show.
    this.sendSelection(2);
    this.setState({
      index: this.state.index + 1,
    });
  }

  onRejectClick() {
    // Send the negative label to flask,
    // and update the index so the next image will show.
    this.sendSelection(0);
    this.setState({
      index: this.state.index + 1,
    });
  }

  onBackClick() {
    this.setState({
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
    var body = null;
    {
      console.log("Parent Props\n", this.state.images);
    }
    if (this.state.view === "tutorial")
      body = <TutorialScreen end={this.endTutorial} />;
    else if (this.state.view === "active")
      body = this.state.images ? (
        <SwipeScreen
          index={this.state.index}
          batch_size={this.state.batch_size}
          image={this.state.images[this.state.index]}
          onAcceptClick={this.onAcceptClick}
          onRejectClick={this.onRejectClick}
          onSkipClick={this.onSkipClick}
          onBackClick={this.onBackClick}
        />
      ) : (
        <Button loading={true} />
      );
    else if (this.state.view === "end") body = <EndScreen />;
    return <div className="App">{body}</div>;
  }
}
