import React from "react";
import "../styles.css";
import moon from "../tutorial-images/moon.jpg";
import flag from "../tutorial-images/flag.jpg";
import earthrise from "../tutorial-images/earthrise.jpg";
import rightarrow from "../tutorial-images/arrowright.gif";
import leftarrow from "../tutorial-images/arrowleft.gif";
import downarrow from "../tutorial-images/arrowdown.gif";
import TinderCard from "react-tinder-card";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

class TutorialHelper extends React.Component {
  constructor(props) {
    super(props);
    let awesome = "https://media.giphy.com/media/l2Sqir5ZxfoS27EvS/giphy.gif";
    this.state = {
      images: [earthrise, moon, flag],
      index: 0,
      arrows: [rightarrow, leftarrow, downarrow, awesome],
      captions: [
        "Drag in this direction to swipe right! (Accept)",
        "Drag in this direction to swipe left! (Reject)",
        "Drag in this direction to swipe down! (Skip)",
        "We're done here!",
      ],
    };
    //bind functions
    this.onTutorialSwipe = this.onTutorialSwipe.bind(this);
  }

  onTutorialSwipe() {
    console.log("reached onswipe!!");
    this.setState({
      index: this.state.index + 1,
    });
  }
  render() {
    return (
      <>
        <div className="Tutorial_Image_wrapper">
          <div className="tut-helper-text">
            <div>{this.state.captions[this.state.index]}</div>
            <img
              className="tut-helper-gifs"
              src={this.state.arrows[this.state.index]}
              alt=""
            />
          </div>
          <TinderCard
            onSwipe={this.onTutorialSwipe}
            preventSwipe={["right", "left", "down"]}
          >
            <img
              className={"Question_Image"}
              src={this.state.images[this.state.index]}
              alt=""
            />
          </TinderCard>
        </div>
      </>
    );
  }
}

export { TutorialHelper };
