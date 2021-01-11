# Swipe-Labeler Tool

<p>This graphical user interface tool allows for rapid labeling of image data. Images from your unlabeled images directory will be presented one at a time in a graphical user interface. For each image, the user can choose to either “Accept” or “Reject” the image for the classification in question.</p><p>For example, if you’re looking to label images as either containing or not containing a cat, the user would choose “Accept” for any cat image presented and “Reject” for any image presented that doesn’t contain a cat. The application then moves the newly labeled image file from your unlabeled images directory to your chosen positive or negative directory, depending on the user’s label choice.</p><p>The user has three methods to classify each presented image.  The user may: click on the “Accept” or “Reject” buttons, swipe the image to the right for “Accept” or to the left for “Reject”, or use the keyboard right arrow key for “Accept” and the keyboard left arrow key for “Reject”.</p>


## Setup (for development)

1. Clone this repo \
    `git clone https://github.com/spaceml-org/Swipe-Labeler`

2. Navigate into this project's root directory. \
    `cd Swipe-Labeler`

3. You’ll need to have python3 and pip installed as well as npm. (See FAQ's below.)


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
**Important Note** - When you run this application, a subfolder will be created for you inside your IMAGES_DIRECTORY. This subfolder, "**swipe_labeler_data**", will contain the following:

    * **swipe_labeler_data/unlabeled** - Containing **copies** of all of the images in IMAGES_DIRECTORY. These files will be moved from this location when they are labeled using the application.
    
    * **swipe_labeler_data/labeled_positive** - Gets populated with the image files labeled positive when the user clicks "Accept", swipes right, or presses the right arrow key on the keyboard. 
    
    * **swipe_labeler_data/labeled_negative** - Gets populated with the image files labeled negative when the user clicks "Reject", swipes left, or presses the arrow left key on the keyboard. 


### Setting up the web application

8. Navigate back to the project's root directory. \
    `cd ..`

9. Use npm to install the javascript files and their dependencies. \
    `npm install`



## Usage (for development)

Run these two commands in two different terminal shells opened to the project's root directory:

1. `npm start`

2. (In a separate terminal shell) `cd api` and then `flask run`

