import React from "react";
import "./styles.css";
import moon from "./tutorial-images/moon.jpg";
import flag from "./tutorial-images/flag.jpg";
import earthrise from "./tutorial-images/earthrise.jpg";
import astronaut from "./tutorial-images/astronaut.jpg";
import TinderCard from "react-tinder-card";
import { Button } from "@blueprintjs/core";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

export default class App extends React.Component {
  // Main component
  constructor(props) {
    super(props);
    this.state = {
      view: "tutorial",
      index: 0,
      images: null,
      batch_size: null,
    };

    // bind functions
    this.fetchImages = this.fetchImages.bind(this);
    this.sendSelection = this.sendSelection.bind(this);
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
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

  onRejectClick() {
    // Send the negative label to flask,
    // and update the index so the next image will show.
    this.sendSelection(0);
    this.setState({
      index: this.state.index + 1,
    });
  }

  endTutorial() {
    this.setState({
      view: "active",
    });
  }

  render() {
    var body = null;

    if (this.state.view === "tutorial")
      body = <TutorialScreen end={this.endTutorial} />;
    else if (this.state.view === "active")
      body = this.state.images ? (
        <SwipeScreen
          index={this.state.index}
          image={this.state.images[this.state.index]}
          onAcceptClick={this.onAcceptClick}
          onRejectClick={this.onRejectClick}
        />
      ) : (
        <Button loading={true} />
      );
    else if (this.state.view === "end") body = <EndScreen />;

    return <div className="App">{body}</div>;
  }
}

class SwipeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onSwipe = this.onSwipe.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  componentWillMount() {
    // Listens for the keyboard key press events. (Uses "keyup" so the button is only pressed once per choice.)
    document.addEventListener("keyup", this.onKeyPress, false);
  }

  componentWillUnmount() {
    // Removes the key press event listener if this component is replaced by another component or view.
    // (Currently there are no other components to replace this view, however.)
    document.removeEventListener("keyup", this.onKeyPress);
  }

  onSwipe = (direction) => {
    // From TinderCard
    if (direction === "right") {
      this.props.onAcceptClick();
    } else if (direction === "left") {
      this.props.onRejectClick();
    }
  };

  onKeyPress = (event) => {
    // Key press alternatives
    if (event.key === "ArrowRight") {
      this.props.onAcceptClick();
    } else if (event.key === "ArrowLeft") {
      this.props.onRejectClick();
    }
  };

  render() {
    return (
      <div className="SwipeScreen">
        <div className="Question">
          <div className="Image_wrapper">
            <TinderCard onSwipe={this.onSwipe} preventSwipe={["right", "left"]}>
              <img src={this.props.image} alt="" />
            </TinderCard>
          </div>

          <Button
            icon="small-cross"
            className="AcceptRejectButton"
            intent="primary"
            onClick={this.props.onRejectClick}
          >
            Reject
          </Button>

          <Button
            icon="tick"
            className="AcceptRejectButton"
            intent="success"
            onClick={this.props.onAcceptClick}
          >
            Accept
          </Button>
        </div>
      </div>
    );
  }
}

class TutorialScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevLabel: null,
      tutorialIndex: 0,
      tutorialImages: [moon, earthrise, flag],
      tutorialMessages: [
        {
          title: "Welcome to the Swipe Labeler tool.",
          caption:
            'You can label images in three ways. First click "Accept" or "Reject" to continue.',
        },
        { caption: "Now try swiping the image to the left or to the right." },
        {
          caption:
            "Now try a keyboard shortcut. Press your arrow left key or your arrow right key on your keyboard.",
        },
      ],
    };

    this.onTutorialAcceptClick = this.onTutorialAcceptClick.bind(this);
    this.onTutorialRejectClick = this.onTutorialRejectClick.bind(this);
    this.onTutorialSwipe = this.onTutorialSwipe.bind(this);
    this.onTutorialKeyPress = this.onTutorialKeyPress.bind(this);
  }

  componentWillMount() {
    // Listens for the keyboard key press events. (Uses "keyup" so the button is only pressed once per choice.)
    document.addEventListener("keyup", this.onTutorialKeyPress, false);
  }

  componentWillUnmount() {
    // Removes the key press event listener if this component is replaced by another component or view.
    // (Currently there are no other components to replace this view, however.)
    document.removeEventListener("keyup", this.onTutorialKeyPress);
  }

  onTutorialAcceptClick() {
    // This and onTutorialRejectClick could be one just one function: onTutorialClick.
    // Kept as separate function in case later want to add interaction based on user's choice.
    if (this.state.tutorialIndex === this.state.tutorialImages.length - 1) {
      this.props.end();
    }
    this.setState({
      prevLabel: "accept",
      tutorialIndex: this.state.tutorialIndex + 1,
    });
  }

  onTutorialRejectClick() {
    // This and onTutorialAcceptClick could be one just one function: onTutorialClick.
    // Kept as separate function in case later want to add interaction based on user's choice.
    if (this.state.tutorialIndex === this.state.tutorialImages.length - 1) {
      this.props.end();
    }
    this.setState({
      prevLabel: "reject",
      tutorialIndex: this.state.tutorialIndex + 1,
    });
  }

  onTutorialSwipe(direction) {
    // From TinderCard
    if (direction === "right") {
      this.onTutorialAcceptClick();
    } else if (direction === "left") {
      this.onTutorialRejectClick();
    }
  }

  onTutorialKeyPress = (event) => {
    // Key press alternatives
    if (event.key === "ArrowRight") {
      this.onTutorialAcceptClick();
    } else if (event.key === "ArrowLeft") {
      this.onTutorialRejectClick();
    }
  };

  render() {
    var message = this.state.tutorialMessages[this.state.tutorialIndex];
    return (
      <div className="TutorialScreen">
        <div className="Question">
          <div className="Image_wrapper">
            <TinderCard
              onSwipe={this.onTutorialSwipe}
              preventSwipe={["right", "left"]}
            >
              <div
                className="TutorialScreen_Question_Image"
                style={{
                  backgroundImage:
                    "url('" +
                    this.state.tutorialImages[this.state.tutorialIndex] +
                    "')",
                }}
              >
                <div className="TutorialScreen_Question_Image_Text">
                  <div className="TutorialScreen_Question_Image_Text_Title">
                    {message.title}
                  </div>
                  <div className="TutorialScreen_Question_Image_Text_Caption">
                    {message.caption}
                  </div>
                  {/* {this.state.tutorialMessages[this.state.tutorialIndex]} */}
                </div>
              </div>
            </TinderCard>
          </div>

          <Button
            icon="small-cross"
            className="AcceptRejectButton"
            intent="primary"
            onClick={this.onTutorialRejectClick}
          >
            Reject
          </Button>

          <Button
            icon="tick"
            className="AcceptRejectButton"
            intent="success"
            onClick={this.onTutorialAcceptClick}
          >
            Accept
          </Button>
        </div>
      </div>
    );
  }
}

class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  sendEnd() {
    // When the user clicks end,
    // that choice gets sent to flask.
    fetch("/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ready_to_end: "ready",
      }),
    });
  }

  render() {
    return (
      <div
        className="EndScreen"
        style={{
          backgroundImage: "url('" + astronaut + "')",
        }}
      >
        <div className="EndScreen_Text">
          Mission accomplished! Good job! Click the button to start training the
          model.
        </div>
        <Button
          icon="tick"
          className="AcceptRejectButton"
          intent="success"
          onClick={this.sendEnd}
        >
          Train Model
        </Button>
      </div>
    );
  }
}
