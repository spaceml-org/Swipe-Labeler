import React,{useEffect} from "react";
import "../styles.css";
import astronaut from "../tutorial-images/astronaut.jpg";
import { Button, ProgressBar } from "@blueprintjs/core";
import Confetti from 'react-confetti'
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
  
    render() {
      return (
        <>
        <Confetti/>
        <div
          className="EndScreen"
          style={{
            backgroundImage: "url('" + astronaut + "')",
          }}
        >
          <div className="EndScreen_Text">Mission accomplished! Good job!</div>
          {/* <Sparkle /> */}
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
  export {EndScreen};