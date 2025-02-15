import base64
import json
from io import BytesIO

import numpy as np
import onnxruntime as ort
from firebase_functions import https_fn
from PIL import Image

# Initialize ONNX session
_MODEL_PATH = "tomato/tomato.onnx"
_ort_session = ort.InferenceSession(_MODEL_PATH, providers=["CPUExecutionProvider"])
_input_name = _ort_session.get_inputs()[0].name  # 'timm_image_image'
_input_name_valid = _ort_session.get_inputs()[1].name  # 'timm_image_image_valid_num'
_output_name = _ort_session.get_outputs()[1].name  # Correct output name


_CLASS_NAMES_TOMATO = [
    "Early_blight",
    "Healthy",
    "Late_blight",
    "Leaf Miner",
    "Magnesium Deficiency",
    "Nitrogen Deficiency",
    "Pottassium Deficiency",
    "Spotted Wilt Virus",
]


def preprocess_image_tomato(image: Image.Image):
    image = image.convert("RGB")
    ratio = 224 / min(image.size)
    new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
    image = image.resize(new_size, Image.BICUBIC)
    image = image.crop(
        (
            (new_size[0] - 224) // 2,
            (new_size[1] - 224) // 2,
            (new_size[0] + 224) // 2,
            (new_size[1] + 224) // 2,
        )
    )
    image_np = np.array(image).astype(np.float32)
    r, g, b = image_np[:, :, 0], image_np[:, :, 1], image_np[:, :, 2]
    image_np[:, :, 0] = (r / 255.0 - 0.485) / 0.229
    image_np[:, :, 1] = (g / 255.0 - 0.456) / 0.224
    image_np[:, :, 2] = (b / 255.0 - 0.406) / 0.225
    image_np = image_np.transpose((2, 0, 1))
    image_np = np.expand_dims(image_np, axis=[0, 1])  # Add batch and sequence dims
    return image_np


def infer_onnx_tomato(image: Image.Image):
    image_np = preprocess_image_tomato(image)
    results = _ort_session.run(
        [_output_name],
        {
            _input_name: image_np,
            _input_name_valid: np.array([1], dtype=np.int64),
        },
    )[0]
    predicted_class_index = np.argmax(results[0])
    return _CLASS_NAMES_TOMATO[predicted_class_index]


@https_fn.on_request()
def classify_tomato(req: https_fn.Request) -> https_fn.Response:
    try:
        image_base64 = req.json.get("image")
        if not image_base64:
            return https_fn.Response("No image provided in base64 format.", status=400)

        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))

        prediction = infer_onnx_tomato(image)

        return https_fn.Response(
            json.dumps({"prediction": prediction}),
            status=200,
            content_type="application/json",
        )

    except Exception as e:
        print(f"Error processing image: {e}")
        return https_fn.Response(f"Error processing image: {e}", status=500)
