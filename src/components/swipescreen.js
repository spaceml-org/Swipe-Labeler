import React from "react";
import "../styles.css";
import TinderCard from "react-tinder-card";
import Timer from "./timer";
import { Button, ProgressBar, Icon } from "@blueprintjs/core";
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Clipboard from "clipboard";

class SwipeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      batchTotal: this.props.batch_size,
    };

    //bind functions
    this.decideCountText = this.decideCountText.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keyup", this.onKeyPress, false);
  }

  componentWillUnmount() {
    // Removes the key press event listener if this component is replaced by another component or view.
    // (Currently there are no other components to replace this view, however.)
    document.removeEventListener("keyup", this.onKeyPress);
  }

  onSwipe = (direction) => {
    // From TinderCard
    this.setState({
      loading: true,
    });
    if (direction === "right") {
      this.props.onAcceptClick();
    } else if (direction === "left") {
      this.props.onRejectClick();
    } else if (direction === "down") {
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

  decideCountText() {
    //Helper function to render progress of correct width on the progress bar

    let text = "";

    let y;

    y = this.props.imagesLeft;

    if (this.props.imagesLeft > this.props.batch_size) {
      y = this.props.batch_size;
    }
    if (y == 0) {
      text = "Last Image!";
      return [text, this.props.noOfSwipes / this.props.batchStop];
    }
    if (y !== 1) text = y + " Images Left!";
    else text = y + " Image Left!";
    return [text, this.props.noOfSwipes / this.props.batchStop];
  }

  detectMob() {
    // helper function to check type of device(mobile/desktop)
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  decideImgRender() {
    let obj;
    if (this.detectMob()) {
      obj = (
        <TinderCard
          onSwipe={this.onSwipe}
          preventSwipe={["right", "left", "down", "up"]}
        >
          <img src={this.props.image} alt="" />
        </TinderCard>
      );
    } else {
      obj = (
        <TinderCard
          onSwipe={this.onSwipe}
          preventSwipe={["right", "left", "down", "up"]}
        >
          <TransformWrapper
            options={{ centerContent: true }}
            defaultPositionX={50}
          >
            <TransformComponent>
              <img src={this.props.image} alt="" />
            </TransformComponent>
          </TransformWrapper>
        </TinderCard>
      );
    }
    return obj;
  }

  render() {
    let [count_text, x] = this.decideCountText();
    let obj = this.decideImgRender();
    var clipboard = new Clipboard(".clipboard");
    return (
      <>
        {console.log("swipscreen props= ", this.props)}
        <div className="header">
          <div className="count">
            <div className="timer">
              <Timer />
            </div>
            <div className="ct-grp">
              <span>
                Labeled {this.props.labeledSize} out of{" "}
                {this.props.batch_size + this.props.labeledSize + 1}
              </span>
              <br></br>
              <span>{count_text}</span>
              {console.log("x= ", x)}
              <br></br>
            </div>
            <div className="button-grp">
              <Button
                className="quit-button"
                intent="danger"
                onClick={this.props.onQuitClick}
                small={true}
              >
                <Icon icon="cross" iconSize={20} intent="danger" />{" "}
              </Button>
              <Button
                id="share-button"
                className="clipboard"
                data-clipboard-target="#blank"
                data-clipboard-text={window.location.href}
                intent="primary"
                small={true}
                onClick={() => alert("Link copied to clipboard!")}
              >
                <Icon icon="share" iconSize={20} />
              </Button>
            </div>
          </div>
        </div>
        <div id="#SwipeScreen" className="Content">
          <div className="Image_wrapper">
            <div className="prog-bar">
              <ProgressBar intent="success" value={x}></ProgressBar>
            </div>
            {obj}
          </div>
          <div className="footer">
            <input type="text" id="blank" value={window.location.href} />
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
            <Button
              icon="small-cross"
              className="AcceptRejectButton"
              intent="primary"
              onClick={this.props.onRejectClick}
            >
              Reject
            </Button>
            <Button
              icon="undo"
              disabled={this.props.undoHappened}
              className="BackButton"
              onClick={this.props.onBackClick}
            >
              Undo
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export { SwipeScreen };
