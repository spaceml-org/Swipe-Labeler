import time
from pathlib import Path
import os
import shutil

from flask import Flask, request, send_from_directory



app = Flask(__name__)


# For now, you'll need to define these three directories from the command line
# in the environment where you run this.
unlabeled_directory = 'SPACEML_IMAGES_DIR'
positive_directory = 'SPACEML_POS_DIR'
negative_directory = 'SPACEML_NEG_DIR'

# @app.route('/')

@app.route('/images')
def list_image_urls():
    '''Gives the list of urls for the served media files for each of the images.'''
    p = Path(os.environ[unlabeled_directory])
    images = ['/media/' + x.name for x in p.iterdir() if x.name != ".DS_Store"]
    return {'images': images}


@app.route('/media/<filename>')
def serve_image_url(filename):
    '''Serves the single image requested.'''
    return send_from_directory(os.environ[unlabeled_directory], filename)


@app.route('/submit', methods=['POST'])
def submit_label():
    '''Saves the labeled image file into the positive or negative directory'''
    # Get the label value of this image from the request.
    value = request.get_json()['value']
    image_url = request.get_json()['image_url']
    # This line cuts off the '/media' at the start of the image_url from request.
    image_name = image_url[6:]

    # Access the environment variables defined above (I'll change this later)
    old = Path(os.environ[unlabeled_directory])
    old_string = str(old)
    old_path_string = old_string + image_name

    pos = Path(os.environ[positive_directory])
    pos_string = str(pos)
    pos_path_string = pos_string + image_name

    neg = Path(os.environ[negative_directory])
    neg_string = str(neg)
    neg_path_string = neg_string + image_name

    if value == 1:
        # Move the file to the positive directory.
        shutil.move(old_path_string, pos_path_string)

    elif value == 0:
        # Move the file to the negative directory.
        shutil.move(old_path_string, neg_path_string)

    return {'status': 'success'}


if __name__=="__main__":
    app.run()
