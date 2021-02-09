# Swipe-Labeler Tool

**Swipe Labeler is a Graphical User Interface based tool that allows rapid labeling of image data.**

![](https://github.com/spaceml-org/Swipe-Labeler/blob/main/Swipe-Labeler-Demo.gif)
    
Images will be picked one by one from your unlabeled images directory, and presented through the Swipe Labeler GUI. For each image, the user can choose to classify the image as a positive or negative/absent class using the “Accept” or “Reject” button.

For example, if you’re looking to label images as either containing or not containing a cat, the user would choose “Accept” for any images with a cat, and “Reject” for any images without a cat. The application then transfers the newly labeled image file from your unlabeled images directory to your chosen positive or negative directory. The user can choose the label (e.g. cat, dog) too. The user has three ways to input the classification choice:

- [Standard version] Click on the “Accept” or “Reject” buttons
- [Social version] Swipe to the right for “Accept” or left for “Reject”
- [Gamified version] Use the keyboard right arrow key for “Accept” and the keyboard left arrow key for “Reject”.

## Usage

1. You’ll need to have python3 and pip installed. (See FAQ's below.)

2. Clone this repo. \
    `git clone https://github.com/spaceml-org/Swipe-Labeler`

3. Navigate into this project's `api` directory. \
    `cd Swipe-Labeler/api`

4. Optionally, create and activate a virtual environment. 

    * Create a virtual environment. \
        `python3 -m venv venv`

    * Activate the virtual environment. \
        ` . venv/bin/activate`

5. From inside the api directory, install the python dependencies (Flask plus more). \
    `pip install -r requirements.txt`

6. From here within the virtual environment, define one environment variable: the directory that contains your unlabeled images. \
        `export TO_BE_LABELED_DIRECTORY=(your unlabeled images directory complete path)` \
\
**Important Note** - When you run this application, a new folder will be created for you (if doesn't already exist) under the same parent directory as your `TO_BE_LABELED_DIRECTORY`. This sibling directory, `Labeled`, will contain the following:
    
    * **Labeled/Labeled_Positive** - Gets populated with the image files labeled positive when the user clicks "Accept", swipes right, or presses the right arrow key on the keyboard. 
    
    * **Labeled/Labeled_Negative** - Gets populated with the image files labeled negative when the user clicks "Reject", swipes left, or presses the arrow left key on the keyboard. 

7. Run the application. \
`flask run`




## Setup (for development)

1. You’ll need to have python3 and pip installed **as well as npm**. (See FAQ's below.) 

2. Clone this repo \
    `git clone https://github.com/spaceml-org/Swipe-Labeler`

3. Navigate into this project's root directory. \
    `cd Swipe-Labeler`


### Setting up the web server

4. Navigate into the subdirectory: "api". \
    `cd api`

5. Optionally, create and activate a virtual environment. 

    * Create a virtual environment. \
        `python3 -m venv venv`

    * Activate the virtual environment. \
        ` . venv/bin/activate`

6. From inside the api directory, install the python dependencies (Flask plus more). \
    `pip install -r requirements.txt`

7. From here within the virtual environment, define one environment variable: the directory that contains your unlabeled images. \
        `export IMAGES_DIRECTORY=(your unlabeled images directory complete path)` \
\
**Important Note** - When you run this application, a new folder will be created for you (if doesn't already exist) under the same parent directory as your `TO_BE_LABELED_DIRECTORY`. This sibling directory, `Labeled`, will contain the following:
    
    * **Labeled/Labeled_Positive** - Gets populated with the image files labeled positive when the user clicks "Accept", swipes right, or presses the right arrow key on the keyboard. 
    
    * **Labeled/Labeled_Negative** - Gets populated with the image files labeled negative when the user clicks "Reject", swipes left, or presses the arrow left key on the keyboard.


### Setting up the web application

8. Navigate back to the project's root directory. \
    `cd ..`

9. Use npm to install the javascript files and their dependencies. \
    `npm install`



### Usage (for development)

Run these two commands in two different terminal shells opened to the project's root directory:

1. `npm start`

2. (In a separate terminal shell) `cd api` and then `flask run` 


## FAQ's
1. **Do I need to have npm installed to run this?** \
If you are not developing, you do not need to have npm installed. \
If you would like to run it for development, however, you will need to have it installed (and follow the development instructions above).

2. **What is npm? How do I download npm?** \
npm is basically an installation package for javascript, like pip is for python. You can find more information here : https://www.npmjs.com/get-npm . 

3. **Do I need to use Python 3?** \
Yes. But if this conflicts with the version you have working on your system, you can isolate this version inside a virtual environment (see optional instructions for this above). More info here: https://www.python.org/downloads/ .

4. **Do I need to use pip to install the python packages?** \
You can use other methods, but the instructions above are written using pip. You can find more information about pip here: https://pip.pypa.io/en/stable/installing/ .


## About the authors

## Citation
Please cite us if you use our code.

```
@article{,
  title={},
  author={},
  url={},
  year={},
  publisher={}
}
```
