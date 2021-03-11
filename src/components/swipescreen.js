import React,{useEffect} from "react";
import "../styles.css";
// import moon from "./tutorial-images/moon.jpg";
// import flag from "./tutorial-images/flag.jpg";
// import earthrise from "./tutorial-images/earthrise.jpg";
// import astronaut from "./tutorial-images/astronaut.jpg";
import TinderCard from "react-tinder-card";
import Timer from './timer'
import { Button, ProgressBar } from "@blueprintjs/core";
// import Sparkle from 'react-sparkle'
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class SwipeScreen extends React.Component {
    constructor(props) {
      super(props);
  
      this.onSwipe = this.onSwipe.bind(this);
      this.onKeyPress = this.onKeyPress.bind(this);
  
      //bind functions
      this.decideCountText = this.decideCountText.bind(this);
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
      }else if (direction === "down") {
        this.props.onSkipClick();
      }
  
    };
  
    onKeyPress = (event) => {
      // Key press alternatives
      if (event.key === "ArrowRight") {
        this.props.onAcceptClick();
      } else if (event.key === "ArrowLeft") {
        this.props.onRejectClick();
      } else if (event.key === "ArrowDown") {
        this.props.onSkipClick();
      }
    };
  
    decideCountText(){
      //Helper function to render progress of correct width on the progress bar
      let text = ""
      let x = this.props.batch_size - this.props.index;
      if(x !== 1)
        text = x+" Images Left!";
      else
        text = x+" Image Left!";
      return [text,(this.props.index)/(this.props.batch_size)]
    }
  
    render() {
      let [count_text,x] = this.decideCountText();    
      return (
        <>
          {console.log("props= ",this.props)}
          <div className="count">
              <span>Batch Total: {this.props.batch_size}</span>
              <br></br>
              <span>{count_text}</span>
              {console.log("x= ",x)}
              <br></br>
              <span className="prog-bar"><ProgressBar  intent="success" value={x} ></ProgressBar></span>
          </div>
          <div className="timer">
              <Timer />
          </div>
          <div className="SwipeScreen">
            <div className="Question">
              <div className="Image_wrapper">
              <TinderCard onSwipe={this.onSwipe} preventSwipe={["right", "left","down","up"]}>
                  <TransformWrapper options={{centerContent:true}} defaultPositionX={50}>
                    <TransformComponent>
                      <img src={this.props.image} alt=""  />
                  {/* <Magnifier imageSrc={this.props.image} alt="" /> */}
                   </TransformComponent>
                  </TransformWrapper>
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
                icon="remove"
                className="AcceptRejectButton"
                intent="danger"
                onClick={this.props.onSkipClick}
              >
                Skip
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
            <Button
                icon="undo"
                disabled={this.props.index === 0}
                className="BackButton"
                onClick={this.props.onBackClick}
              >
                Undo
            </Button>
        </div>
        </>
      );
    }
  }

  export {SwipeScreen};