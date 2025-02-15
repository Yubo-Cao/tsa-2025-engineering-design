import base64
from io import BytesIO

import numpy as np
import tensorflow as tf
import tensorflow.lite as tflite
from firebase_functions import https_fn
from PIL import Image

# Initialize TFLite interpreter
_MODEL_PATH = "melon/melon.tflite"
_interpreter = tflite.Interpreter(model_path=_MODEL_PATH)
_interpreter.allocate_tensors()
_input_details = _interpreter.get_input_details()
_output_details = _interpreter.get_output_details()

_CLASS_NAMES_MELON = [
    "Calcium Deficiency",
    "Healthy",
    "Nitrogen Deficiency",
    "Potassium Deficiency",
]


def preprocess_image_melon(image):
    image = image.convert("RGB")
    image = image.resize((224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = tf.expand_dims(image, axis=0)
    image = tf.keras.applications.convnext.preprocess_input(image)
    return image


def infer_tflite_melon(image):
    input_data = preprocess_image_melon(image)
    _interpreter.set_tensor(_input_details[0]["index"], input_data)
    _interpreter.invoke()
    output_data = _interpreter.get_tensor(_output_details[0]["index"])
    predicted_class_index = np.argmax(output_data[0])
    return _CLASS_NAMES_MELON[predicted_class_index]


@https_fn.on_request()
def classify_melon(req: https_fn.Request) -> https_fn.Response:
    try:
        image_base64 = req.json.get("image")
        if not image_base64:
            return https_fn.Response("No image provided in base64 format.", status=400)

        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))

        prediction = infer_tflite_melon(image)

        return https_fn.Response(
            {"prediction": prediction}, status=200, content_type="application/json"
        )

    except Exception as e:
        print(f"Error processing image: {e}")
        return https_fn.Response(f"Error processing image: {e}", status=500)
