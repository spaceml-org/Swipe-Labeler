import React,{useEffect} from "react";
import "./styles.css";
import moon from "./tutorial-images/moon.jpg";
import flag from "./tutorial-images/flag.jpg";
import earthrise from "./tutorial-images/earthrise.jpg";
import astronaut from "./tutorial-images/astronaut.jpg";
import TinderCard from "react-tinder-card";
import Timer from './components/timer'
import { Button, ProgressBar } from "@blueprintjs/core";
// import Sparkle from 'react-sparkle'
import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
// import { Magnifier, GlassMagnifier,SideBySideMagnifier,PictureInPictureMagnifier,MOUSE_ACTIVATION,TOUCH_ACTIVATION
// } from "react-image-magnifiers";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import SwipeScreen from './swipescreen'

function hasSeenTutorial() {
  // Checks for a cookie on the users computer that will tell the user has already done the tutorial.
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("hasSeenTutorial="));
}

function setTutorialSeen() {
  document.cookie = "hasSeenTutorial=true";
}

export default class App extends React.Component {
  // Main component
  constructor(props) {
    super(props);
    this.state = {
      view: hasSeenTutorial() ? "active" : "tutorial",
      index: 0,
      images: null,
      batch_size: null,
    };

    // bind functions
    this.fetchImages = this.fetchImages.bind(this);
    this.sendSelection = this.sendSelection.bind(this);
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onRejectClick = this.onRejectClick.bind(this);
    this.onSkipClick = this.onSkipClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.endTutorial = this.endTutorial.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // When the index gets updated, show the next image.
      if (
        prevState.index !== this.state.index &&
        this.state.index === this.state.batch_size
      )
        this.fetchImages();
}

  componentDidMount() {
    // When the app loads, get all the image urls from flask.
    this.fetchImages();
  }

  fetchImages() {
    // Collect the list of image urls to request one by one later.
    fetch("/images")
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          images: data.images,
          batch_size: data.images.length,
          index: 0,
        });
        if (!data.images.length)
          this.setState({
            view: "end",
          });
      });
  }

  sendSelection(value) {
    // When the user swipes, clicks, or presses a choice (accept or reject),
    // that choice gets sent to flask.
    fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: this.state.images[this.state.index],
        value: value,
      }),
    });
  }

  onAcceptClick() {
    // Send the positive label to flask,
    // and update the index so the next image will show.
    this.sendSelection(1);
    this.setState({
      index: this.state.index + 1,
    });
  }

  onSkipClick(){
    // Send no label to flask, mark as ambigous with constant value 10
    // and update the index so the next image will show.
    this.sendSelection(2);
    this.setState({
      index: this.state.index + 1,
    })
  }

  onRejectClick() {
    // Send the negative label to flask,
    // and update the index so the next image will show.
    this.sendSelection(0);
    this.setState({
      index: this.state.index + 1,
    });
  }

  onBackClick() {
    this.setState({
      index: this.state.index - 1,
    });
  }

  endTutorial() {
    this.setState({
      view: "active",
    });
    // Set a cookie on the user's browser so they don't see the tutorial again.
    setTutorialSeen();
  }

  render() {
    var body = null;
    // {console.log("Parent Props\n",this.state.images)}
    if (this.state.view === "tutorial")
      body = <TutorialScreen end={this.endTutorial} />;
    else if (this.state.view === "active")
      body = this.state.images ? (
        <SwipeScreen
          index={this.state.index}
          batch_size={this.state.batch_size}
          image={this.state.images[this.state.index]}
          onAcceptClick={this.onAcceptClick}
          onRejectClick={this.onRejectClick}
          onSkipClick={this.onSkipClick}
          onBackClick={this.onBackClick}
        />
      ) : (
        <Button loading={true} />
      );
    else if (this.state.view === "end") 
      body = <EndScreen />
      // body = <EndScreen 
      //          image={this.state.images[4]}
      //          onAcceptClick={this.onAcceptClick}
      //          onRejectClick={this.onRejectClick}
      //          onSkipClick={this.onSkipClick}
      //          onBackClick={this.onBackClick}
      //       />;

    return <div className="App">{body}</div>;
  }
}

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
    let text = ""
    let x = this.props.batch_size - this.props.index;
    if(x !== 1)
      text = x+" Images Left!";
    else
      text = x+" Image Left!";
    return [text,2*(this.props.index)/5]
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

class TutorialScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevLabel: null,
      tutorialIndex: 0,
      tutorialImages: [moon, earthrise, flag],
      tutorialMessages: [
        {
          title: "Welcome to the Swipe Labeler tool.",
          caption:
            'You can label images in three ways. First click "Accept", "Reject" or "Skip" to continue.',
        },
        { caption: "Now try swiping the image left,right, or downwards!." },
        {
          caption:
            "Now try a keyboard shortcut. Press your arrow left key,arrow right key, or your arrow down key on your keybord.",
        },
      ],
    };

    this.onTutorialAcceptClick = this.onTutorialAcceptClick.bind(this);
    this.onTutorialRejectClick = this.onTutorialRejectClick.bind(this);
    this.onTutorialSkipClick = this.onTutorialSkipClick.bind(this);
    this.onTutorialSwipe = this.onTutorialSwipe.bind(this);
    this.onTutorialKeyPress = this.onTutorialKeyPress.bind(this);
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

  onTutorialAcceptClick() {
    // This and onTutorialRejectClick could be one just one function: onTutorialClick.
    // Kept as separate function in case later want to add interaction based on user's choice.
    if (this.state.tutorialIndex === this.state.tutorialImages.length - 1) {
      this.props.end();
    }
    this.setState({
      prevLabel: "accept",
      tutorialIndex: this.state.tutorialIndex + 1,
    });
  }

  onTutorialSkipClick() {
    // This and onTutorialAcceptClick could be one just one function: onTutorialClick.
    // Kept as separate function in case later want to add interaction based on user's choice.
    if (this.state.tutorialIndex === this.state.tutorialImages.length - 1) {
      this.props.end();
    }
    this.setState({
      prevLabel: "skip",
      tutorialIndex: this.state.tutorialIndex + 1,
    });
  }

  onTutorialRejectClick() {
    // This and onTutorialAcceptClick could be one just one function: onTutorialClick.
    // Kept as separate function in case later want to add interaction based on user's choice.
    if (this.state.tutorialIndex === this.state.tutorialImages.length - 1) {
      this.props.end();
    }
    this.setState({
      prevLabel: "reject",
      tutorialIndex: this.state.tutorialIndex + 1,
    });
  }

  onTutorialSwipe(direction) {
    // From TinderCard
    if (direction === "right") {
      this.onTutorialAcceptClick();
    } else if (direction === "left") {
      this.onTutorialRejectClick();
    } else if (direction === "down") {
      this.onTutorialSkipClick();
    }
  }

  onTutorialKeyPress = (event) => {
    // Key press alternatives
    if (event.key === "ArrowRight") {
      this.onTutorialAcceptClick();
    } else if (event.key === "ArrowLeft") {
      this.onTutorialRejectClick();
    }
    else if (event.key === "ArrowDown") {
      this.onTutorialSkipClick();
    }
  };

  render() {
    var message = this.state.tutorialMessages[this.state.tutorialIndex];
    return (
      <div className="TutorialScreen">
        <div className="Question">
          <div className="Image_wrapper">
            <TinderCard
              onSwipe={this.onTutorialSwipe}
              preventSwipe={["right", "left","down"]}
            >
              <div
                className="TutorialScreen_Question_Image"
                style={{
                  backgroundImage:
                    "url('" +
                    this.state.tutorialImages[this.state.tutorialIndex] +
                    "')",
                }}
              >
                <div className="TutorialScreen_Question_Image_Text">
                  <div className="TutorialScreen_Question_Image_Text_Title">
                    {message.title}
                  </div>
                  <div className="TutorialScreen_Question_Image_Text_Caption">
                    {message.caption}
                  </div>
                  {/* {this.state.tutorialMessages[this.state.tutorialIndex]} */}
                </div>
              </div>
            </TinderCard>
          </div>

          <Button
            icon="small-cross"
            className="AcceptRejectButton"
            intent="primary"
            onClick={this.onTutorialRejectClick}
          >
            Reject
          </Button>

          <Button
            icon="remove"
            className="AcceptRejectButton"
            intent="danger"
            onClick={this.onTutorialSkipClick}
          >
            Skip
          </Button>      

          <Button
            icon="tick"
            className="AcceptRejectButton"
            intent="success"
            onClick={this.onTutorialAcceptClick}
          >
            Accept
          </Button>
        </div>
      </div>
    );
  }
}


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