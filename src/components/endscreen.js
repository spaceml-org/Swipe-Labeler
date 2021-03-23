import React, { useEffect } from "react";
import "../styles.css";
import astronaut from "../tutorial-images/astronaut.jpg";
import { Button, ProgressBar } from "@blueprintjs/core";
import Confetti from "react-confetti";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

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

  getSwipeTime() {
    // return document.cookie
    //   .split(";")
    //   .some((item) => item.trim().startsWith("swipeTime="));
    let time;
    let decoded = decodeURIComponent(document.cookie);
    decoded.split(";").forEach((item) => {
      if (item.trim().startsWith("swipeTime")) time = item.trim().split("=")[1];
    });
    console.log("time= ", time);
    return time;
  }

  render() {
    return (
      <>
        <Confetti />
        <div
          className="EndScreen"
          style={{
            backgroundImage: "url('" + astronaut + "')",
          }}
        >
          {/* {console.log("time:", this.getSwipeTime())} */}
          <div className="EndScreen_Text">Mission accomplished! Good job!</div>
          {/* <Sparkle /> */}
          <div className="EndScreen_Time_Text">
            Your labelling time: {this.getSwipeTime()} seconds...
          </div>
          <Button
            icon="tick"
            className="AcceptRejectButton"
            intent="success"
            onClick={this.sendEnd}
          >
            Close
          </Button>
        </div>
      </>
    );
  }
}
export { EndScreen };
