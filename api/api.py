import time
from pathlib import Path
import os
import shutil

from flask import Flask, request, send_from_directory


app = Flask(__name__)


@app.route('/images')
def list_image_urls():
    '''Gives the list of urls for the served media files for each of the images.'''
    orig_images_path = Path(os.environ['IMAGES_DIRECTORY'])
    # Create swipe_labeler_data folder if it doesn't already exist.
    data_folder = os.path.join(str(orig_images_path), 'swipe_labeler_data')
    if not os.path.exists(data_folder):
        os.mkdir(data_folder)

    # Create swipe_labeler_data/unlabeled folder if it doesn't already exist.
    unlabeled_folder = os.path.join(data_folder, 'unlabeled')
    if not os.path.exists(unlabeled_folder):
        os.mkdir(unlabeled_folder)
        # Copy all of the images in original_images into unlabeled_folder
        for image in orig_images_path.iterdir():
            new_copy = os.path.join(unlabeled_folder, image.name)
            if not os.path.isdir(image):
                if not os.path.exists(new_copy):
                    shutil.copy(image, new_copy)
 
    # Create swipe_labeler_data/labeled_positive folder if it doesn't already exist.
    labeled_positive = os.path.join(data_folder, 'labeled_positive')
    if not os.path.exists(labeled_positive):
        os.mkdir(labeled_positive)
    
    # Create swipe_labeler_data/labeled_positive folder if it doesn't already exist.
    labeled_negative = os.path.join(data_folder, 'labeled_negative')
    if not os.path.exists(labeled_negative):
        os.mkdir(labeled_negative)

    # A list of all the served urls for each of the images in the unlabeled_folder.
    images = ['/media/' + x.name for x in Path(unlabeled_folder).iterdir() if x.name != ".DS_Store" and x.name !="swipe_labeler_data"]
       
    return {'images': images}


@app.route('/media/<filename>')
def serve_image_url(filename):
    '''Serves the single image requested.'''
    # Because these variables can't be shared between routes, 
    # define the source of unlabeled images in terms of the one environment variable ('IMAGES_DIRECTORY')
    # defined in the command line by the user.
    orig_images_path = Path(os.environ['IMAGES_DIRECTORY'])
    unlabeled_folder = os.path.join(str(orig_images_path), 'swipe_labeler_data', 'unlabeled')
    unlabeled_path = Path(unlabeled_folder)
    # Serves the single image requested.
    return send_from_directory(unlabeled_path, filename)


@app.route('/submit', methods=['POST'])
def submit_label():
    '''Saves the labeled image file into the positive or negative directory'''
    # Get the label value of this image from the request.
    value = request.get_json()['value']
    image_url = request.get_json()['image_url']
    # This line cuts off the '/media' at the start of the image_url from request.
    image_name = image_url[6:]

    # Because these variables can't be shared between routes, 
    # define the folders to move images to and from in terms of the one environment variable ('IMAGES_DIRECTORY')
    # that was defined in the command line by the user.
    orig_images_path = Path(os.environ['IMAGES_DIRECTORY'])
    unlabeled_folder = os.path.join(str(orig_images_path), 'swipe_labeler_data', 'unlabeled')
    old_path_string = unlabeled_folder + image_name

    positive_folder = os.path.join(str(orig_images_path), 'swipe_labeler_data', 'labeled_positive')
    pos_path_string = positive_folder + image_name

    negative_folder = os.path.join(str(orig_images_path), 'swipe_labeler_data', 'labeled_negative')
    neg_path_string = negative_folder + image_name


    if value == 1:
        # Move the file to the positive folder.
        shutil.move(old_path_string, pos_path_string)

    elif value == 0:
        # Move the file to the negative folder.
        shutil.move(old_path_string, neg_path_string)

    return {'status': 'success'}

