import React from "react";
import "../styles.css";
import moon from "../tutorial-images/moon.jpg";
import flag from "../tutorial-images/flag.jpg";
import earthrise from "../tutorial-images/earthrise.jpg";
import TinderCard from "react-tinder-card";
import { Button } from "@blueprintjs/core";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { TutorialHelper } from "./tutorialhelper";

class TutorialScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevLabel: null,
      tutorialIndex: 0,
      tutorialImages: [moon, earthrise, flag],
      // tutorialMessages: [
      //   {
      //     title: "Welcome to the Swipe Labeler tool.",
      //     caption:
      //       'You can label images in three ways. First try clicking "Accept", "Reject" or "Skip".',
      //   },
      //   // {
      //   //   title: "You can also label images by swiping !",
      //   // },
      //   // {
      //   //   title: "Now try a keyboard shortcut!",
      //   //   caption:
      //   //     "Press your arrow left key,arrow right key, or your arrow down key on your keybord.",
      //   // },
      // ],
    };

    this.onTutorialAcceptClick = this.onTutorialAcceptClick.bind(this);
    this.onTutorialRejectClick = this.onTutorialRejectClick.bind(this);
    this.onTutorialSkipClick = this.onTutorialSkipClick.bind(this);
    this.onTutorialSwipe = this.onTutorialSwipe.bind(this);
    this.onTutorialKeyPress = this.onTutorialKeyPress.bind(this);
    this.decideRender = this.decideRender.bind(this);
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

  decideRender() {
    let obj;
    if (this.state.tutorialIndex === 0) {
      console.log("reached!");
      obj = (
        <>
          <div className="TutorialScreen_Question_Image_Text">
            <div className="TutorialScreen_Question_Image_Text_Title">
              Welcome to the Swipe Labeler tool.
            </div>
            <div className="TutorialScreen_Question_Image_Text_Caption">
              You can label images in three ways. First try clicking "Accept",
              "Reject" or "Skip".
            </div>
          </div>
          <div className="Tutorial_Image_wrapper">
            <TinderCard
              onSwipe={this.onTutorialSwipe}
              preventSwipe={["right", "left", "down"]}
            >
              <img
                className={"Question_Image"}
                src={this.state.tutorialImages[this.state.tutorialIndex]}
                alt=""
              />
            </TinderCard>
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
        </>
      );
    } else
      obj = (
        <div>
          <TutorialHelper end={this.props.end} />
        </div>
      );
    return obj;
  }
  render() {
    let obj = this.decideRender();
    return (
      <div className="TutorialScreen">
        <div className="Question">{obj}</div>
      </div>
    );
  }
}

export { TutorialScreen };
