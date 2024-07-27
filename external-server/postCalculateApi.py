from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import base64
import io
import numpy as np
from PIL import Image
import tensorflow as tf
import tensorflow_hub as hub

app = FastAPI()

# PoseNet 모델 로드
model = hub.load("https://tfhub.dev/google/tfjs-model/posenet/mobilenet_v1_100/4")

class ImageRequest(BaseModel):
    image1: str
    image2: str

def decode_base64_and_load_image(base64_str: str) -> Image.Image:
    """Base64 문자열을 디코딩하여 이미지 객체로 변환합니다."""
    image_data = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_data))
    return image

def preprocess_image(image: Image.Image) -> np.ndarray:
    """이미지를 PoseNet 모델 입력에 맞게 전처리합니다."""
    image = image.convert("RGB").resize((257, 257))
    image_np = np.array(image) / 255.0  # 정규화
    image_np = np.expand_dims(image_np, axis=0)  # 배치 차원 추가
    return image_np

def extract_pose(image_np: np.ndarray) -> np.ndarray:
    """PoseNet 모델을 사용하여 포즈를 추출합니다."""
    keypoints = model.signatures['default'](tf.constant(image_np))
    return keypoints['output_0'].numpy()

def compute_pose_similarity(pose1: np.ndarray, pose2: np.ndarray) -> float:
    """두 포즈의 유사도를 계산합니다 (간단한 거리 측정)."""
    return np.mean(np.linalg.norm(pose1 - pose2, axis=1))

@app.post("/compare")
async def compare_images(request: ImageRequest):
    try:
        # 이미지 로드 및 전처리
        image1 = decode_base64_and_load_image(request.image1)
        image2 = decode_base64_and_load_image(request.image2)

        image_np1 = preprocess_image(image1)
        image_np2 = preprocess_image(image2)

        # 포즈 추출
        pose1 = extract_pose(image_np1)
        pose2 = extract_pose(image_np2)

        # 유사도 계산
        similarity = compute_pose_similarity(pose1, pose2)
        return {"similarity_score": similarity}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 실행 명령어:
# uvicorn script_name:app --reload
