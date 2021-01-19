import time
from pathlib import Path
import os
import shutil

from flask import Flask, request, send_from_directory, render_template

app = Flask(__name__, template_folder=os.path.join(str(Path().absolute().parent), 'build'),
            static_folder=os.path.join(str(Path().absolute().parent), 'build', 'static'))

BATCH_SIZE = 5


@app.route('/')
def index():
    # This serves the react app when the flask app is run.
    return render_template('index.html')


@app.route('/images')
def list_image_urls():
    '''Gives the list of urls for the served media files for each of the images.'''

    # This is the To_Be_Labeled folder (for now passed in as an environment variable.)
    orig_images_path = Path(os.environ['TO_BE_LABELED_DIRECTORY'])
    # Finds the parent of To_Be_Labeled, so Labeled can be created as a sibling folder.
    parent_directory = orig_images_path.parent
    # Define Labeled folder to be at the same level as To_Be_Labeled
    labeled_folder = os.path.join(str(parent_directory), 'Labeled')
    # Make the (parent_directory)/Labeled folder if it doesn't exist already.
    if not os.path.exists(labeled_folder):
        os.mkdir(labeled_folder)

    # Create parent_directory/Labeled/Labeled_Positive folder if it doesn't already exist.
    labeled_positive = os.path.join(labeled_folder, 'Labeled_Positive')
    if not os.path.exists(labeled_positive):
        os.mkdir(labeled_positive)

    # # Create swipe_labeler_data/labeled_positive folder if it doesn't already exist.
    labeled_negative = os.path.join(labeled_folder, 'Labeled_Negative')
    if not os.path.exists(labeled_negative):
        os.mkdir(labeled_negative)

    # # A list of all the served urls for each of the images in the To_Be_Labeled_folder.
    images = ['/media/' + x.name for x in orig_images_path.iterdir(
    ) if x.name != ".DS_Store" and x.name != "swipe_labeler_data"][:BATCH_SIZE]

    return {'images': images}


@app.route('/media/<filename>')
def serve_image_url(filename):
    '''Serves the single image requested.'''
    # This is the To_Be_Labeled folder (for now passed in as an environment variable.)
    orig_images_path = Path(os.environ['TO_BE_LABELED_DIRECTORY'])
    # Serves the single image requested from the To_Be_Labeled folder.
    return send_from_directory(orig_images_path, filename)


@app.route('/submit', methods=['POST'])
def submit_label():
    '''Saves the labeled image file into the positive or negative directory'''

    # Get the label value of this image from the request.
    value = request.get_json()['value']
    image_url = request.get_json()['image_url']
    # This line cuts off the '/media/' at the start of the image_url from request.
    image_name = image_url[7:]

    # These folders are defined in terms of the To_Be_Labeled folder (for now passed in as an environment variable.)
    orig_images_path = Path(os.environ['TO_BE_LABELED_DIRECTORY'])
    parent_directory = orig_images_path.parent
    labeled_folder = os.path.join(str(parent_directory), 'Labeled')
    labeled_positive = os.path.join(labeled_folder, 'Labeled_Positive')
    labeled_negative = os.path.join(labeled_folder, 'Labeled_Negative')
    # These are paths to this specific image in the folders defined above.
    old_path = os.path.join(orig_images_path, image_name)
    pos_path = os.path.join(labeled_positive, image_name)
    neg_path = os.path.join(labeled_negative, image_name)

    # Depending on the value sent by the user, move the image file into the positive or negative folder.
    if value == 1:
        # Move the file to the positive folder.
        shutil.move(old_path, pos_path)
    elif value == 0:
        # Move the file to the negative folder.
        shutil.move(old_path, neg_path)

    return {'status': 'success'}
