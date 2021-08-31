from pathlib import Path
import os
import random
import shutil
import time

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
batch_size = args.batch_size or 5
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

    # Create a temp folder, if it doesnt exist
    app.config["temp"] = os.path.join(Path(path_for_unlabeled).resolve().parent,'temp')
    if os.path.exists(app.config["temp"]):
        shutil.rmtree(app.config["temp"])
        time.sleep(0.5)
    os.mkdir(app.config["temp"])

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
            time.sleep(0.2)
            os.mkdir(labeled_folder)
        #     shutil.rmtree(labeled_folder)
        #     time.sleep(0.2)
        # os.mkdir(labeled_folder)

        # Create parent_directory/Labeled/Labeled_Positive folder if it doesn't already exist.
        labeled_positive = os.path.join(labeled_folder, 'Labeled_Positive')
        if not os.path.exists(labeled_positive):
            time.sleep(0.2)
            os.mkdir(labeled_positive)
            # shutil.rmtree(labeled_positive)
            # time.sleep(0.2)

        # # Create swipe_labeler_data/labeled_positive folder if it doesn't already exist.
        labeled_negative = os.path.join(labeled_folder, 'Labeled_Negative')
        if not os.path.exists(labeled_negative):
            time.sleep(0.2)
            os.mkdir(labeled_negative)
            # shutil.rmtree(labeled_negative)
            # time.sleep(0.2)

        # # Create swipe_labeler_data/labeled_positive folder if it doesn't already exist.
        unsure = os.path.join(labeled_folder, 'Unsure')
        if not os.path.exists(unsure):
           time.sleep(0.2)
           os.mkdir(unsure)

    return app

app = create_app(batch_size, path_for_unlabeled)


@app.route('/')
def index():
    # This serves the react app when the flask app is run.
    print("testing")
    return render_template('index.html')


@app.route('/image',methods=['POST'])
def list_image_url():
    # Servers images by moving them from unlabeled to temp or directly serves from temp
    # Checks if there are images in temp to be served otherwise:
    # Checks the unlabeled directory, picks a random image , returns its url and moves the image to a temp folder

    # Parsing request data
    swipes = request.get_json()['swipes']
    image_url = request.get_json()['image_url']
    if image_url != "none":
        # This line cuts off the '/media/' at the start of the image_url from request.
        image_name = image_url[7:]
 
    #Check if undo was clicked and serve that missed image from temp
    if (image_url != "none"):
        # Pick requested file from temp to display
        if image_name in os.listdir(app.config["temp"]):
            # image = random.choice(os.listdir(app.config["temp"]))
            image_path = os.path.join(app.config["temp"],image_name)
            msg = None
            return {"image":"/media/"+image_name , "path":image_path , "msg":msg,"swipes":swipes,"reached":"1st"}
        else:
            return {"image":"none", "path":"none", "msg":"none","swipes":swipes,"reached":"1st"}
    # Undo didnt happen, pick a random file from unlabeled 
    else:   
        src = app.config["path_for_unlabeled"]
        image = None
        if ( len(os.listdir(src)) ):
            image = random.choice(os.listdir(src))
        else:
            return {"image":"none", "path":"none", "msg":"none","swipes":swipes,"reached":"3rd"}

    # Move current file to temp folder
    image_path = os.path.join(src,image)
    msg = shutil.move(image_path,app.config["temp"])

    return {"image":"/media/"+image , "path":image_path , "msg":msg ,"swipes":int(swipes)}

@app.route('/getsize')
def give_size():
    
    src = app.config["path_for_unlabeled"]
    size = len( [name for name in os.listdir(src)] )

    # Use specific labeled folder paths , if user provided
    if path_for_neg and path_for_pos and path_for_unsure:
        labeled_positive_size = len( [name for name in os.listdir(path_for_neg)])
        labeled_negative_size = len( [name for name in os.listdir(path_for_pos)])
        unsure_size = len( [name for name in os.listdir(path_for_unsure)])
        labeled_size = labeled_negative_size + labeled_positive_size + unsure_size
    # Use default labeled folder paths , if user didnt provide them
    else:       
        parent_directory = os.path.dirname(src)
        labeled_folder = os.path.join(str(parent_directory), 'Labeled')
        labeled_positive = os.path.join(labeled_folder, 'Labeled_Positive')
        labeled_negative = os.path.join(labeled_folder, 'Labeled_Negative')
        unsure = os.path.join(labeled_folder, 'Unsure')
        labeled_positive_size = len( [name for name in os.listdir(labeled_positive)])
        labeled_negative_size = len( [name for name in os.listdir(labeled_negative)])
        unsure_size = len( [name for name in os.listdir(unsure)])
        labeled_size = labeled_negative_size + labeled_positive_size + unsure_size

    # batch_size = min(app.config["batch_size"],size)

    return {"batch_size":size,"batch_stop":batch_size,"labeled_size":labeled_size}

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
    orig_images_path = app.config['temp']
    # Serves the single image requested from the path_for_unlabeled folder.
    return send_from_directory(orig_images_path, filename)

@app.route('/submit', methods=['POST'])
def submit_label():
    '''Saves the labeled image file into the positive,negative or unsure directory'''

    # Get the label value of this image from the request.
    value = request.get_json()['value']
    image_url = request.get_json()['image_url']

    # This line cuts off the '/media/' at the start of the image_url from request.
    image_name = image_url[7:]
    # These folders are defined in terms of the path_for_unlabeled folder (passed as argument when you start this script)
    orig_images_path = app.config['temp']

    

    # If the User provided path arguments then use those paths:
    if(path_for_neg and path_for_pos and path_for_unsure):
        old_path = None
        if os.path.exists(os.path.join(orig_images_path, image_name)):
            msg = "reached nested if"
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
        # The next 3 elif blocks are to check in lableled folder, in case undo was hit on an image
        elif os.path.exists(os.path.join(labeled_positive, image_name)):
            old_path = os.path.join(labeled_positive, image_name)

        elif os.path.exists(os.path.join(labeled_negative, image_name)):
            old_path = os.path.join(labeled_negative, image_name)

        elif os.path.exists(os.path.join(unsure, image_name)):
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

    return {'status': 'success','old_path':old_path}

@app.route('/undo', methods=['POST'])
def undo_swipe():

    # Moves the requested image from labeled to temp
    # Checks in the Labeled folder to retrieve requested image. 
    image_url = request.get_json()['image_url']
    #curr_image_url = request.get_json()['curr_image_url']
    # This line cuts off the '/media/' at the start of the image_url from request.
    image_name = image_url[7:]
    #curr_image_name = curr_image_url[7:]

    # Get the path of Labeled folder and its sub-folders
    # If the User provided path arguments then use those paths:
    if(path_for_neg and path_for_pos and path_for_unsure):
        labeled_positive = path_for_pos
        labeled_negative = path_for_neg
        unsure = path_for_unsure
    # Use default paths, if user didnt provide
    else:
        parent_directory = os.path.dirname(app.config['path_for_unlabeled'])
        labeled_folder = os.path.join(str(parent_directory), 'Labeled')
        labeled_positive = os.path.join(labeled_folder, 'Labeled_Positive')
        labeled_negative = os.path.join(labeled_folder, 'Labeled_Negative')
        unsure = os.path.join(labeled_folder, 'Unsure')
    # Define paths for sub-folder/image
    pos_path = os.path.join(labeled_positive, image_name)
    neg_path = os.path.join(labeled_negative, image_name)
    unsure_path = os.path.join(unsure,image_name)
    # Search and transfer requested image to temp folder for serving in future
    # dest_path = os.path.join(app.config['path_for_unlabeled'],image_name)
    dest_path = os.path.join(app.config['temp'],image_name)
    # Search and transfer requested image to temp folder for serving in future
    if (os.path.exists(pos_path)):
        shutil.move(pos_path,dest_path)
    elif (os.path.exists(neg_path)):
        shutil.move(neg_path,dest_path)
    elif (os.path.exists(unsure_path)):
        shutil.move(unsure_path,dest_path)
    else:
        return {'msg':"ERROR!"}
    return {"status":"success",}

@app.route('/quit',methods=['POST'])
def quit_app():
    msg = None
    # Transfer the request image from temp to unlabeled folder
    image_url = request.get_json()['image_url']
    curr_image_url = request.get_json()['curr_image_url']
    # This line cuts off the '/media/' at the start of the image_url from request.
    image_name = image_url[7:]
    if(curr_image_url != "none"):
        curr_image_name = curr_image_url[7:]
        src = os.path.join(app.config['temp'],curr_image_name)
        dest = os.path.join(app.config['path_for_unlabeled'],curr_image_name)
        msg = shutil.move(src,dest)
    
    src = os.path.join(app.config['temp'],image_name)
    dest = os.path.join(app.config['path_for_unlabeled'],image_name)
    msg = shutil.move(src,dest)

    return {'status':'success','msg':msg}

@app.route('/refresh',methods=['POST'])
def refresh_handler():
    msg1 = None
    # Transfer the requested image from temp to unlabeled folder
    image_url = request.get_json()['image_url']
    curr_image_url = request.get_json()['curr_image_url']
    if( not image_url and curr_image_url == "none"):
         return {'status':'nothing to move'}
    #This line cuts off the '/media/' at the start of the image_url from request.
    image_name = image_url[7:]
    src2 = None
    msg2 = None
    if(curr_image_url != "none"):
        curr_image_name = curr_image_url[7:]
        src2 = os.path.join(app.config['temp'],curr_image_name)
        dest = os.path.join(app.config['path_for_unlabeled'],curr_image_name)
        if( not os.path.exists(src2)):  
            return {'status':'nothing to move'}
        msg2 = shutil.move(src2,dest)
    
    src = os.path.join(app.config['temp'],image_name)
    if(not os.path.exists(src)):
        return {'status':'nothing to move',"msg":msg1}
    dest = os.path.join(app.config['path_for_unlabeled'],image_name)
    msg1 = shutil.move(src,dest)

    return {'status':'success','msg1':msg1,'msg2':msg2}

@app.route('/end', methods=['GET', 'POST'])
def end_app():
    ready_to_end = request.get_json()['ready_to_end']
    if ready_to_end == 'ready':
        shutdown_hook = request.environ.get('werkzeug.server.shutdown')
        if shutdown_hook is not None:
            shutdown_hook()
    return {'status': 'success'}


app.run(host='0.0.0.0',port=int('8080'))
