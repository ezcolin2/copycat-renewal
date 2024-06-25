import React, { useRef, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs';

const App = () => {
  const canvasRef = useRef(null);
  const posenetModelRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current = document.querySelector('#main-video video');
    const loadPosenet = async () => {
      posenetModelRef.current = await posenet.load();
      console.log('모델 로드 완료');
    };
    
    loadPosenet();
  }, []);

  const handleButtonClick = () => {
    const video =  document.querySelector('#main-video video');
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    video.width = video.offsetWidth;
    video.height = video.offsetHeight;
    canvas.width = video.width;
    canvas.height = video.height;
    
    canvas.style.position = 'absolute';
    canvas.style.left = video.offsetLeft + 'px';
    canvas.style.top = video.offsetTop + 'px';

    const predict = () => {
      posenetModelRef.current.estimateSinglePose(video).then((pose) => {
        canvas.width = video.width; 
        canvas.height = video.height;
        drawKeypoints(pose.keypoints, 0.6, context); 
        drawSkeleton(pose.keypoints, 0.6, context);
      });
      requestAnimationFrame(predict);
    };

    predict();
  };

  const drawKeypoints = (keypoints, minConfidence, ctx, scale = 1) => {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < minConfidence) continue;
      const { y, x } = keypoint.position;
      drawPoint(ctx, y * scale, x * scale, 3, 'aqua');
    }
  };

  const drawSkeleton = (keypoints, minConfidence, ctx, scale = 1) => {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);
    adjacentKeyPoints.forEach((keypoints) => {
      drawSegment(
        toTuple(keypoints[0].position),
        toTuple(keypoints[1].position),
        'aqua',
        scale,
        ctx
      );
    });
  };

  const toTuple = ({ y, x }) => [y, x];

  const drawPoint = (ctx, y, x, r, color) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawSegment = ([ay, ax], [by, bx], color, scale, ctx) => {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ position: 'relative' }} />
      <button id="draw" onClick={handleButtonClick}>Draw</button>
    </div>
  );
};

export default App;
