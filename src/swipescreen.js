import React, { useEffect } from "react";
import "./styles.css";
import TinderCard from "react-tinder-card";
import Timer from "./timer";
import { Button, ProgressBar } from "@blueprintjs/core";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

//The SwipScreen component:
export default function SwipeScreen(props) {
  //helper functions for SwipeScreen:

  let onSwipe = (direction) => {
    // From TinderCard
    if (direction === "right") {
      props.onAcceptClick();
    } else if (direction === "left") {
      props.onRejectClick();
    } else if (direction === "down") {
      props.onSkipClick();
    }
  };

  let onKeyPress = (event) => {
    // Key press alternatives
    if (event.key === "ArrowRight") {
      props.onAcceptClick();
    } else if (event.key === "ArrowLeft") {
      props.onRejectClick();
    } else if (event.key === "ArrowDown") {
      props.onSkipClick();
    }
  };

  let decideCountText = (size, index) => {
    let text = "";
    let x = size - index;
    if (x !== 1) text = x + " Images Left!";
    else text = x + " Image Left!";
    return [text, props.index / 5];
  };

  //helper functions end
  //   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
  //     return null
  //   }

  const transcript = useSpeechRecognition(commands);

  // useEffect(() => {
  //   // subscribe event
  //   document.addEventListener("keyup", this.onKeypress());
  //   return () => {
  //     // unsubscribe event
  //     document.removeEventListener("keyup", this.onKeypress());
  //   };
  // }, []);

  let [count_text, x] = decideCountText(props.batch_size, props.index);
  return (
    <>
      {console.log("props= ", props)}
      <div className="count">
        <span>Batch Total: {props.batch_size}</span>
        <br></br>
        <span>{count_text}</span>
        {console.log("x= ", x)}
        <br></br>
        <span className="prog-bar">
          <ProgressBar intent="success" value={x}></ProgressBar>
        </span>
      </div>
      <div className="timer">
        <Timer />
      </div>
      <div className="SwipeScreen">
        <div className="Question">
          <div className="Image_wrapper">
            <TinderCard
              onSwipe={onSwipe}
              preventSwipe={["right", "left", "down", "up"]}
            >
              <TransformWrapper
                options={{ centerContent: true }}
                defaultPositionX={50}
              >
                <TransformComponent>
                  <img src={props.image} alt="" />
                  {/* <Magnifier imageSrc={props.image} alt="" /> */}
                </TransformComponent>
              </TransformWrapper>
            </TinderCard>
          </div>
          <Button onClick={SpeechRecognition.startListening}>
            Activate Voice!
          </Button>
          <Button
            icon="small-cross"
            className="AcceptRejectButton"
            intent="primary"
            onClick={props.onRejectClick}
          >
            Reject
          </Button>
          <Button
            icon="remove"
            className="AcceptRejectButton"
            intent="danger"
            onClick={props.onSkipClick}
          >
            Skip
          </Button>
          <Button
            icon="tick"
            className="AcceptRejectButton"
            intent="success"
            onClick={props.onAcceptClick}
          >
            Accept
          </Button>
        </div>
        <Button
          icon="undo"
          disabled={props.index === 0}
          className="BackButton"
          onClick={props.onBackClick}
        >
          Undo
        </Button>
        <p id="transcript">Transcript: {transcript}</p>
      </div>
    </>
  );
}
