import React from "react";
import "../styles.css";
import moon from "../tutorial-images/moon.jpg";
import flag from "../tutorial-images/flag.jpg";
import earthrise from "../tutorial-images/earthrise.jpg";
import astronaut from "../tutorial-images/astronaut.jpg";
import rightarrow from "../tutorial-images/arrowright.gif";
import leftarrow from "../tutorial-images/arrowleft.gif";
import downarrow from "../tutorial-images/arrowdown.gif";
// import nailedit from "../tutorial-images/nailedit.jfif";
import nailedit from "../tutorial-images/nailedit2.gif";
import TinderCard from "react-tinder-card";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@blueprintjs/core";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

class TutorialHelper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [earthrise, moon, flag],
      index: 0,
      arrows: [rightarrow, leftarrow, downarrow, flag],
      captions: [
        "Drag in this direction to swipe right! (Accept)",
        "Drag in this direction to swipe left! (Reject)",
        "Drag in this direction to swipe down! (Skip)",
        // "We're done here!",
        "Now try a keyboard shortcut.Press the arrow right, arrow left or arrow down key!",
      ],
    };
    //bind functions
    this.onTutorialKeyPress = this.onTutorialKeyPress.bind(this);
    this.onTutorialSwipe = this.onTutorialSwipe.bind(this);
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

  onTutorialKeyPress = (event) => {
    // Key press alternatives
    if (event.key === "ArrowRight") {
      this.onTutorialSwipe();
    } else if (event.key === "ArrowLeft") {
      this.onTutorialSwipe();
    } else if (event.key === "ArrowDown") {
      this.onTutorialSwipe();
    }
  };

  onTutorialSwipe() {
    console.log("reached onswipe!!");
    this.setState({
      index: this.state.index + 1,
    });
  }

  detectTouch() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  decideRender() {
    let obj;

    if (this.state.index === 3 && !this.detectTouch()) {
      console.log("reached!");
      obj = (
        <>
          <div className="Tutorial_Zoom_Text">
            <div className="TutorialScreen_Question_Image_Text">
              <div className="TutorialScreen_Question_Image_Text_Title">
                {/* Now try a keyboard shortcut */}
                You can zoom in!
              </div>
              <div className="TutorialScreen_Question_Image_Text_Caption">
                If you're not sure what the image looks like, we've got you
                covered!
                <br></br>
                Scroll up and down while your mouse on the image to toggle
                zoom...
                {/* <br></br> */}
                {/* Press the arrow right, arrow left or arrow down key! */}
              </div>
            </div>
          </div>
          <div className="Tutorial_Image_wrapper" style={{ marginTop: "20px" }}>
            <TinderCard
              onSwipe={this.onTutorialSwipe}
              preventSwipe={["right", "left", "down"]}
            >
              <TransformWrapper
                options={{ centerContent: true }}
                defaultPositionX={50}
              >
                <TransformComponent>
                  <img className={"Question_Image"} src={astronaut} alt="" />
                </TransformComponent>
              </TransformWrapper>
            </TinderCard>
          </div>
          <div
            className="TutorialScreen_Question_Image_Text"
            style={{ marginTop: "20px" }}
          >
            <div className="TutorialScreen_Question_Image_Text_Title">
              A third way to label images- try a keyboard shortcut
            </div>
            <div className="TutorialScreen_Question_Image_Text_Caption">
              Press the arrow right, arrow left or arrow down key!
            </div>
          </div>
        </>
      );
    } else if (
      this.state.index === 0 ||
      this.state.index === 1 ||
      this.state.index === 2
    ) {
      obj = (
        <div>
          <div className="TutorialScreen_Question_Image_Text">
            <div className="TutorialScreen_Question_Image_Text_Title">
              You can also label images by swiping!
            </div>
          </div>
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
        </div>
      );
    } else if (this.detectTouch() || this.state.index === 4) {
      console.log("reached");
      let awesome = "https://media.giphy.com/media/l2Sqir5ZxfoS27EvS/giphy.gif";

      obj = (
        <>
          <div className="Tutorial_Image_wrapper">
            <div className="tut-helper-text">
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                We're done here!
              </div>
              <img className="nailed-it-gif" src={nailedit} alt="" />
            </div>
            <Button
              style={{ marginTop: "15px" }}
              intent="success"
              onClick={() => this.props.end()}
            >
              Start Labelling!
            </Button>
          </div>
        </>
      );
    }
    return obj;
  }

  render() {
    let obj = this.decideRender();
    return <>{obj}</>;
  }
}

export { TutorialHelper };
