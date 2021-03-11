import React,{useEffect} from "react";
import "../styles.css";
// import moon from "./tutorial-images/moon.jpg";
// import flag from "./tutorial-images/flag.jpg";
// import earthrise from "./tutorial-images/earthrise.jpg";
import astronaut from "../tutorial-images/astronaut.jpg";
import TinderCard from "react-tinder-card";
import Timer from './timer'
import { Button, ProgressBar } from "@blueprintjs/core";
// import Sparkle from 'react-sparkle'
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
      );
    }
  }
  export {EndScreen};