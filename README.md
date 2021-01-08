# Swipe-Labeler Tool

<p>This graphical user interface tool allows for rapid labeling of image data. Images from your unlabeled images directory will be presented one at a time in a graphical user interface. For each image, the user can choose to either “Accept” or “Reject” the image for the classification in question.</p><p>For example, if you’re looking to label images as either containing or not containing a cat, the user would choose “Accept” for any cat image presented and “Reject” for any image presented that doesn’t contain a cat. The application then moves the newly labeled image file from your unlabeled images directory to your chosen positive or negative directory, depending on the user’s label choice.</p><p>The user has three methods to classify each presented image.  The user may: click on the “Accept” or “Reject” buttons, swipe the image to the right for “Accept” or to the left for “Reject”, or use the keyboard right arrow key for “Accept” and the keyboard left arrow key for “Reject”.</p>


## Setup (for development)

1. Clone this repo 
    `git clone https://github.com/spaceml-org/Swipe-Labeler`

2. Navigate into this project's root directory. 
    `cd Swipe-Labeler`

3. You’ll need to have python3 (https://www.python.org/downloads/) and pip (https://pip.pypa.io/en/stable/installing/) installed as well as npm (https://www.npmjs.com/get-npm).


### Setting up the web server

4. Navigate into the subdirectory: "api". 
    `cd api`

5. Optionally, create and activate a virtual environment.

    * Create a virtual environment. 
        `python3 -m venv venv`

    * Activate the virtual environment. 
        ` . venv/bin/activate`

6. From inside the api directory, install the python dependencies (Flask plus more). 
    `pip install -r requirements.txt`

7. From here within the virtual environment, define three environment variables:

    * The directory that contains your unlabeled images. Keep in mind that the files in this folder will be moved from here once labeled using the tool. 
        `export SPACEML_IMAGES_DIR=(your unlabeled images directory)`

    * The directory where you would like to store the images labeled positive (where the images will go when "Accept" is chosen in the graphical interface).  
        `export SPACEML_POS_DIR=(your directory to be filled with positive newly-labeled images)`

    * The directory where you would like to store the images labeled negative (where the images will go when "Reject" is chosen in the graphical interface). 
        `export SPACEML_NEG_DIR=(your directory to be filled with negative newly-labeled images)`


### Setting up the web application

8. Navigate back to the project's root directory. 
    `cd ..`

9. Use npm to install the javascript files and their dependencies. 
    `npm install`



## Usage (for development)

Run these two commands in two different terminal shells opened to the project's root directory:

1. `npm start`

2. (In a separate terminal shell) `cd api` and then `flask run`

