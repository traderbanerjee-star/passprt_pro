from flask import Flask, request, send_file
from rembg import remove
from PIL import Image
import io
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    file = request.files['image']
    input_image = Image.open(file.stream)

    # Remove BG
    no_bg = remove(input_image)

    # Convert to OpenCV
    img = np.array(no_bg)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 
                                         'haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Crop around face
    if len(faces) > 0:
        x, y, w, h = faces[0]
        crop = img[y:y+h+200, x:x+w+200]
    else:
        crop = img

    output = Image.fromarray(crop)

    img_io = io.BytesIO()
    output.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)