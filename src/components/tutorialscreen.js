import React, { useEffect } from "react";
import "../styles.css";
import moon from "../tutorial-images/moon.jpg";
import flag from "../tutorial-images/flag.jpg";
import earthrise from "../tutorial-images/earthrise.jpg";
import astronaut from "../tutorial-images/astronaut.jpg";
import TinderCard from "react-tinder-card";
import Timer from "./timer";
import { Button, ProgressBar } from "@blueprintjs/core";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

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
            'You can label images in three ways. First click "Accept", "Reject" or "Skip" to continue.',
        },
        { caption: "Now try swiping the image left,right, or downwards!." },
        {
          caption:
            "Now try a keyboard shortcut. Press your arrow left key,arrow right key, or your arrow down key on your keybord.",
        },
      ],
    };

    this.onTutorialAcceptClick = this.onTutorialAcceptClick.bind(this);
    this.onTutorialRejectClick = this.onTutorialRejectClick.bind(this);
    this.onTutorialSkipClick = this.onTutorialSkipClick.bind(this);
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

  onTutorialSkipClick() {
    // This and onTutorialAcceptClick could be one just one function: onTutorialClick.
    // Kept as separate function in case later want to add interaction based on user's choice.
    if (this.state.tutorialIndex === this.state.tutorialImages.length - 1) {
      this.props.end();
    }
    this.setState({
      prevLabel: "skip",
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
    } else if (direction === "down") {
      this.onTutorialSkipClick();
    }
  }

  onTutorialKeyPress = (event) => {
    // Key press alternatives
    if (event.key === "ArrowRight") {
      this.onTutorialAcceptClick();
    } else if (event.key === "ArrowLeft") {
      this.onTutorialRejectClick();
    } else if (event.key === "ArrowDown") {
      this.onTutorialSkipClick();
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
              preventSwipe={["right", "left", "down"]}
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
            icon="remove"
            className="AcceptRejectButton"
            intent="danger"
            onClick={this.onTutorialSkipClick}
          >
            Skip
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

export { TutorialScreen };
