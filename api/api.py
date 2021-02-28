from pathlib import Path
import os
import shutil

from flask import Flask, request, send_from_directory, render_template, session
from flask.logging import create_logger
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument('--batch_size', type=int, help='how many items to label')
parser.add_argument('--path_for_unlabeled', type=str,
                    help='folder with images to be labeled')
parser.add_argument('--path_for_pos_labels',type=str,
                    help='folder with images labeled positive')
parser.add_argument('--path_for_neg_labels',type=str,
                    help='folder with images labeled negative')
parser.add_argument('--path_for_unsure_labels',type=str,
                    help='folder with images labeled unsure')

args = parser.parse_args()
batch_size = args.batch_size
path_for_unlabeled = args.path_for_unlabeled
path_for_pos = args.path_for_pos_labels
path_for_neg = args.path_for_neg_labels
path_for_unsure = args.path_for_unsure_labels

def create_app(batch_size, path_for_unlabeled):
    react_build_directory = os.path.join(
        str(Path(__file__).resolve().parent.parent), 'build')
    # Redirects the template folder and the static folder to the react build directory.
    # This allows users to run the application without having to download and run node.
    app = Flask(__name__, template_folder=react_build_directory,
                static_folder=os.path.join(react_build_directory, 'static'))
    app.config['batch_size'] = batch_size
    app.config['path_for_unlabeled'] = path_for_unlabeled

    # Create copy of path_for_unlabeled directory with jpg filetype regardless of original filetypes.
    app.config['media_dir'] = os.path.join(
        Path(path_for_unlabeled).resolve().parent, 'media')
    if os.path.exists(app.config['media_dir']):
        shutil.rmtree(app.config['media_dir'])
    shutil.copytree(app.config['path_for_unlabeled'], app.config['media_dir'])

    return app


app = create_app(batch_size, path_for_unlabeled)


@app.route('/')
def index():
    # This serves the react app when the flask app is run.
    print("testing")
    return render_template('index.html')


@app.route('/images')
def list_image_urls():
    '''Gives the list of urls for the served media files for each of the images.'''

    # This is the path_for_unlabeled folder that is passed in as an argument when starting this script.
    orig_images_path = app.config['path_for_unlabeled']
    # Finds the parent of path_for_unlabeled, so Labeled can be created as a sibling folder.
    parent_directory = os.path.dirname(orig_images_path)

    #if user provided arguments for paths then define driectory based on that:
    if(path_for_neg and path_for_pos and path_for_unsure):
        # Make the positive label folder
        if not os.path.exists(path_for_pos):
            os.mkdir(path_for_pos)
        # Make the negative label folder
        if not os.path.exists(path_for_neg):
            os.mkdir(path_for_neg)
        # Make the unsure label folder
        if not os.path.exists(path_for_unsure):
            os.mkdir(path_for_unsure)

    #default case incase user doesnt provide argument paths for labelling folders
    else:
        # Define Labeled folder to be at the same level as path_for_unlabeled
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

    # # A list of all the served urls for each of the images in the path_for_unlabeled_folder.
    images = ['/media/' + x.name for x in Path(orig_images_path).iterdir(
    ) if x.name != ".DS_Store" and x.name != "swipe_labeler_data"][:app.config['batch_size']]

    return {'images': images }

#helper route to log test requests, can be removed after project completion
@app.route('/details')
def giveDetails():
    #return "<h1>Hello world</h1>"
    if(path_for_neg):
        return {'msg':path_for_neg}
    else:
        return {'msg':"no path provided"}

@app.route('/media/<filename>')
def serve_image_url(filename):
    '''Serves the single image requested.'''
    # This is the path_for_unlabeled folder that is passed in as an argument when starting this script.
    orig_images_path = app.config['media_dir']
    # Serves the single image requested from the path_for_unlabeled folder.
    return send_from_directory(orig_images_path, filename)


@app.route('/submit', methods=['POST'])
def submit_label():
    '''Saves the labeled image file into the positive or negative directory'''

    # Get the label value of this image from the request.
    value = request.get_json()['value']
    image_url = request.get_json()['image_url']

    # This line cuts off the '/media/' at the start of the image_url from request.
    image_name = image_url[7:]
    # These folders are defined in terms of the path_for_unlabeled folder (passed as argument when you start this script)
    orig_images_path = app.config['path_for_unlabeled']
    # If the User provided path arguments then use those paths:
    if(path_for_neg and path_for_pos and path_for_unsure):
        old_path = None
        if os.path.exists(os.path.join(orig_images_path, image_name)):
            old_path = os.path.join(orig_images_path, image_name)
        
        elif os.path.exists(os.path.join(path_for_pos, image_name)) :
            old_path = os.path.join(path_for_pos, image_name)

        elif os.path.exists(os.path.join(path_for_neg, image_name)) :
            old_path = os.path.join(path_for_neg, image_name)

        elif os.path.exists(os.path.join(path_for_unsure, image_name)) :
            old_path = os.path.join(path_for_unsure, image_name)

        pos_path = os.path.join(path_for_pos, image_name)
        neg_path = os.path.join(path_for_neg, image_name)
        unsure_path = os.path.join(path_for_unsure,image_name)

        # Depending on the value sent by the user, move the image file into the positive,negative or unsure folder.
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

    # If user hasnt provided path arguments , use the following as default folders:    
    else:
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

        elif os.path.exists(os.path.join(labeled_positive, image_name)):
            old_path = os.path.join(labeled_positive, image_name)

        elif os.path.exists(os.path.join(labeled_negative, image_name)) :
            old_path = os.path.join(labeled_negative, image_name)

        elif os.path.exists(os.path.join(unsure, image_name)) :
            old_path = os.path.join(unsure, image_name)


        pos_path = os.path.join(labeled_positive, image_name)
        neg_path = os.path.join(labeled_negative, image_name)
        unsure_path = os.path.join(unsure,image_name)

        # Depending on the value sent by the user, move the image file into the positive,negative or unsure folder.
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
