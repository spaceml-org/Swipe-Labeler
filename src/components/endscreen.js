import React from "react";
import "../styles.css";
import astronaut from "../tutorial-images/astronaut.jpg";
import { Button } from "@blueprintjs/core";
import Confetti from "react-confetti";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //bind functions
    this.decideContinue = this.decideContinue.bind(this);
  }

  sendClose() {
    console.log("sendClose!!!!@!!!");
    window.open("", "_parent", "");
    window.close();
  }

  sendShutDown() {
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

  detectTouch() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  getSwipeTime() {
    let time;
    let decoded = decodeURIComponent(document.cookie);
    decoded.split(";").forEach((item) => {
      if (item.trim().startsWith("swipeTime")) time = item.trim().split("=")[1];
    });

    return time;
  }

  decideContinue() {
    let obj;
    if (this.props.continue)
      obj = (
        <Button
          icon="label"
          id="end-btn"
          className="EndScreenButton"
          intent="primary"
          text={true}
          onClick={() => window.location.reload()}
        >
          Continue Labelling
        </Button>
      );
    else obj = null;
    return obj;
  }

  decideWarning() {
    let warning;
    if (this.detectTouch())
      warning = (
        <>
          <div className="end-btn1">
            <Button
              id="end-btn"
              icon="stop"
              className="EndScreenButton"
              intent="danger"
              onClick={this.sendShutDown}
            >
              Shut down App
            </Button>
          </div>
          <div
            style={{
              display: "block",
              backgroundColor: "antiquewhite",
              fontSize: "1rem",
            }}
          >
            {" "}
            Warning: If other people are using the App, ShutDown ends it for
            them too!
          </div>
        </>
      );
    else
      warning = (
        <>
          <div className="end-btn1">
            <Button
              id="end-btn"
              icon="stop"
              className="EndScreenButton"
              intent="danger"
              onClick={this.sendShutDown}
            >
              Shut down App
            </Button>
          </div>
          <div className="hover-text">
            Warning: If other people are using the App, this ends it for them
            too!
          </div>
        </>
      );
    return warning;
  }
  render() {
    this.props.setTutorialSeen();
    let obj = this.decideContinue();
    let warning = this.decideWarning();
    return (
      <>
        <Confetti />
        <div
          className="EndScreen"
          style={{
            backgroundImage: "url('" + astronaut + "')",
          }}
        >
          <div className="EndScreen_Text">Mission accomplished! Good job!</div>
          <div className="EndScreen_Time_Text">
            Your labelling time: {this.getSwipeTime()} seconds...
          </div>
          <div className="endscreen-btn-grp">
            {obj}

            {/* <Button
              id="end-btn"
              icon="small-cross"
              className="EndScreenButton"
              intent="success"
              onClick={this.sendClose}
            >
              Close App
            </Button> */}
            {warning}
          </div>
        </div>
      </>
    );
  }
}
export { EndScreen };
