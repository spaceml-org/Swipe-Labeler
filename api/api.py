from pathlib import Path
import os
import shutil

from flask import Flask, request, send_from_directory, render_template, session
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument('--batch_size', type=int, help='how many items to label')
parser.add_argument('--to_be_labeled', type=str,
                    help='folder with images to be labeled')
args = parser.parse_args()
batch_size = args.batch_size
to_be_labeled = args.to_be_labeled


def create_app(batch_size, to_be_labeled):
    react_build_directory = os.path.join(
        str(Path(__file__).resolve().parent.parent), 'build')
    # Redirects the template folder and the static folder to the react build directory.
    # This allows users to run the application without having to download and run node.
    app = Flask(__name__, template_folder=react_build_directory,
                static_folder=os.path.join(react_build_directory, 'static'))
    app.config['batch_size'] = batch_size
    app.config['to_be_labeled'] = to_be_labeled

    # Create copy of To_Be_Labeled directory with jpg filetype regardless of original filetypes.
    app.config['media_dir'] = os.path.join(
        Path(to_be_labeled).resolve().parent, 'media')
    if os.path.exists(app.config['media_dir']):
        shutil.rmtree(app.config['media_dir'])
    shutil.copytree(app.config['to_be_labeled'], app.config['media_dir'])

    return app


app = create_app(batch_size, to_be_labeled)


@app.route('/')
def index():
    # This serves the react app when the flask app is run.
    return render_template('index.html')


@app.route('/images')
def list_image_urls():
    '''Gives the list of urls for the served media files for each of the images.'''

    # This is the to_be_labeled folder that is passed in as an argument when starting this script.
    orig_images_path = app.config['to_be_labeled']
    # Finds the parent of To_Be_Labeled, so Labeled can be created as a sibling folder.
    parent_directory = os.path.dirname(orig_images_path)
    # Define Labeled folder to be at the same level as to_be_labeled
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

    # # Create swipe_labeler_data/labeled_positive folder if it doesn't already exist.
    unsure = os.path.join(labeled_folder, 'Unsure')
    if not os.path.exists(unsure):
        os.mkdir(unsure)

    # # A list of all the served urls for each of the images in the To_Be_Labeled_folder.
    images = ['/media/' + x.name for x in Path(orig_images_path).iterdir(
    ) if x.name != ".DS_Store" and x.name != "swipe_labeler_data"][:app.config['batch_size']]

    return {'images': images}


@app.route('/media/<filename>')
def serve_image_url(filename):
    '''Serves the single image requested.'''
    # This is the to_be_labeled folder that is passed in as an argument when starting this script.
    orig_images_path = app.config['media_dir']
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

    # These folders are defined in terms of the To_Be_Labeled folder (passed as argument when you start this script)
    orig_images_path = app.config['to_be_labeled']
    parent_directory = os.path.dirname(orig_images_path)
    labeled_folder = os.path.join(str(parent_directory), 'Labeled')
    labeled_positive = os.path.join(labeled_folder, 'Labeled_Positive')
    labeled_negative = os.path.join(labeled_folder, 'Labeled_Negative')
    unsure = os.path.join(labeled_folder, 'Unsure')

    # These are paths to this specific image in the folders defined above.

    # Look in all 4 places: Unlabeled, Labled_Positive, Labeled_Negative, Labeled_Unsure
    old_path = None
    if os.path.exists(os.path.join(orig_images_path, image_name)):
        old_path = os.path.join(orig_images_path, image_name)

    elif os.path.exists(os.path.join(labeled_positive, image_name)) and value == 0:
        old_path = os.path.join(labeled_positive, image_name)

    elif os.path.exists(os.path.join(labeled_negative, image_name)) and value == 1:
        old_path = os.path.join(labeled_negative, image_name)

    elif os.path.exists(os.path.join(unsure, image_name)) and value == 2:
        old_path = os.path.join(unsure, image_name)


    pos_path = os.path.join(labeled_positive, image_name)
    neg_path = os.path.join(labeled_negative, image_name)
    unsure_path = os.path.join(unsure,image_name)

    # Depending on the value sent by the user, move the image file into the positive or negative folder.
    if old_path:
        if value == 1:
            # Move the file to the positive folder.
            shutil.move(old_path, pos_path)
        elif value == 0:
            # Move the file to the negative folder.
            shutil.move(old_path, neg_path)
        elif value == 2:
            # Move the file to the unsure folder.
            shutil.move(old_path, unsure_path)

    return {'status': 'success'}


@app.route('/end', methods=['GET', 'POST'])
def end_app():
    ready_to_end = request.get_json()['ready_to_end']
    if ready_to_end == 'ready':
        shutdown_hook = request.environ.get('werkzeug.server.shutdown')
        if shutdown_hook is not None:
            shutdown_hook()
    return {'status': 'success'}


app.run(host='0.0.0.0')
