import React from "react";
import "../styles.css";
import welcome from "../welcome.jpeg";
import { Button } from "@blueprintjs/core";

class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const welcomeStyles = {
      backgroundImage: `url(${welcome})`,
      height: "100%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    };
    return (
      <div className="welcome-wrapper" style={welcomeStyles}>
        <div className="welcome-text">
          <h1>Swipe Labeler</h1>
          <p>You could start with a tutorial, or get labelling right away!</p>
          <div className="welcome-btn-grp">
            <Button
              intent="warning"
              className="welcome-btn"
              large={true}
              onClick={this.props.startTutorial}
            >
              Tutorial
            </Button>
            <Button
              intent="warning"
              large={true}
              className="welcome-btn"
              onClick={this.props.startLabel}
            >
              Start Labelling
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export { Welcome };
