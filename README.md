<div align = "center">
<img src="https://github.com/spaceml-org/Swipe-Labeler/blob/main/src/images/banner.jpg" >

<p align="center">
  Published by <a href="http://spaceml.org/">SpaceML</a> •
  <a href="https://arxiv.org/abs/2012.10610">About SpaceML</a> •
</p>

![npm](./src/images/npm.svg) ![javascript](https://img.shields.io/badge/%20%20JavaScript-%20%20%20%20730L-f1e05a.svg) ![html](https://img.shields.io/badge/%20%20HTML-%20%20%20%20164L-e34c26.svg) \
[![Google Colab Notebook Example](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/spaceml-org/Swipe-Labeler/blob/main/Swipe_Labeller_Demo.ipynb)
</div>

# Swipe-Labeler
### About
Swipe Labeler is a Graphical User Interface based tool that allows rapid labeling of image data.
Images will be picked one by one from your unlabeled images directory, and presented through the Swipe Labeler GUI. For each image, the user can choose to classify the image as a positive or negative/absent class using the “Accept” or “Reject” button.

For example, if you’re looking to label images as either containing or not containing a cat, the user would choose “Accept” for any images with a cat, and “Reject” for any images without a cat. The application then transfers the newly labeled image file from your unlabeled images directory to your chosen positive or negative directory. The user can choose the label (e.g. cat, dog) too. The user has three ways to input the classification choice:

- [Standard version] Click on the “Accept”/“Reject”/"Unsure" buttons
- [Social version] Swipe to the right for “Accept”, left for “Reject” and down for "Unsure"
- [Gamified version] Use the keyboard right arrow key for “Accept”,the keyboard left arrow key for “Reject” and the down arrow key for "Unsure".

![](https://github.com/spaceml-org/Swipe-Labeler/blob/main/Swipe-Labeler-Demo.gif)



## Usage

1. You’ll need to have python3 and pip installed. (See FAQ's below.)

2. Clone this repo. \
    `git clone https://github.com/spaceml-org/Swipe-Labeler`
    and `cd Swipe-Labeler`

3. Optionally(but recommended), create and activate a virtual environment. 

    * Create a virtual environment. \
        `python3 -m venv venv`

    * Activate the virtual environment. \
        ` . venv/bin/activate`

4. Install the python dependencies (Flask plus more). \
    `pip install -r api/requirements.txt`

5. Run this this application as a python file. (Don't use "flask run" as you might with other Flask applications.) \
As you do so, pass the complete path to the directory containing the images you want to label (as a string) as the argument `--path_for_unlabeled` . \
        `python api/api.py --path_for_unlabeled=path/to/unlabelled_images_dir --batch_size=5` \
\
**Important Note** - When you run this application, a new folder will be created for you (if doesn't already exist) under the same parent directory as your `path_for_unlabeled`. This sibling directory, `Labeled`, will contain the following:
    
    * **Labeled/Labeled_Positive** - Gets populated with the image files labeled positive when the user clicks "Accept", swipes right, or presses the right arrow key on the keyboard. 
    
    * **Labeled/Labeled_Negative** - Gets populated with the image files labeled negative when the user clicks "Reject", swipes left, or presses the arrow left key on the keyboard. 

    * **Labeled/Unsure** - Gets populated with the image files for which the user clicked the "skip" button. 

6. In your browser, open the url displayed in the terminal window. The app will run on port 5000. \
Copy the following url into your browser's search bar and hit enter. The application should display in your browser window. \
`http://0.0.0.0:5000/`



## Development
### Setup 

1. You’ll need to have python3 and pip installed **as well as npm**. (See FAQ's below.) 

2. Clone this repo \
    `git clone https://github.com/spaceml-org/Swipe-Labeler`

3. Navigate into this project's root directory. \
    `cd Swipe-Labeler`


### Setting up the web server

4. Navigate into the subdirectory: "api". \
    `cd api`

5. Optionally(but recommended), create and activate a virtual environment. 

    * Create a virtual environment. \
        `python3 -m venv venv`

    * Activate the virtual environment. \
        ` . venv/bin/activate`

6. From inside the api directory, install the python dependencies (Flask plus more). \
    `pip install -r requirements.txt`



### Setting up the web application

8. Navigate back to the project's root directory. \
    `cd ..`

9. Use npm to install the javascript files and their dependencies. \
    `npm install`



### Usage (for development)

Run these two commands in two different terminal shells opened to the project's root directory:

1. `npm start`

2. (In a separate terminal shell) Run this this application as a python file. (Don't use "flask run" as you might with other Flask applications.) \
As you do so, pass the complete path to the directory containing the images you want to label (as a string) as the argument `--to_be_labeled` . \
        `python api/api.py --to_be_labeled=path/to/unlabelled_images_dir` \
\
**A Note About Development** - <p>In order to allow the option of using the tool without the need to install all of the javascript packages, the "build" folder is included in this repository, and it serves as the template folder for the Flask application. Because of this, if you are doing development, you should do an\
`npm run build`\
to update the build directory when you are ready to save your work.</p>

 


## FAQ's
1. **Do I need to use Python 3?** \
Yes. But if this conflicts with the version you have working on your system, you can isolate this version inside a virtual environment (see optional instructions for this above). More info here: https://www.python.org/downloads/ .

2. **Do I need to use pip to install the python packages?** \
You can use other methods, but the instructions above are written using pip. You can find more information about pip here: https://pip.pypa.io/en/stable/installing/ .

3. **Do I need to have npm installed to run this?** \
If you are not developing, you do not need to have npm / node.js installed. \
If you would like to run it for development, however, you will need to have node version 12.16.3 installed (and follow the development instructions above).

4. **What is npm? How do I download npm?** \
npm is basically an installation package for javascript, like pip is for python. You can find more information here : https://www.npmjs.com/get-npm . 

## Citation
Please cite us if you use our code.

```
@code{
  title={Swipe-Labeler},
  author={Peterson Jenessa,Ramesh Sumanth,Weerasinghege Udara},
  url={https://github.com/spaceml-org/Swipe-Labeler/},
  year={2021}
}
```
