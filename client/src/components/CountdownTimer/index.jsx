// src/components/Timer.js
import React, { useState, useEffect, useCallback } from 'react';
import { TimerContainer, TimerSVG, CircleBackground, CircleProgress, TimerText } from './styles';
import { useRoomSocket } from '../../contexts/RoomSocketContext';
import { useRefContext } from '../../contexts/RefContext';
import axios from 'axios';

// Timer 컴포넌트
const CountdownTimer = () => {
  const {videoRef, canvasRef} = useRefContext();
  const [seconds, setSeconds] = useState(5);
  const {roomSocket, isTimer, setIsTimer} = useRoomSocket();
  const captureFrameAsFile = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video && canvas && context) {
      // 캔버스 크기를 비디오 크기로 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 캔버스에 비디오의 현재 프레임을 그립니다.
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 캔버스의 내용을 Blob으로 변환
      canvas.toBlob((blob) => {
        if (blob) {
          // Blob을 File 객체로 변환
          const file = new File([blob], 'frame.png', { type: 'image/png' });
          console.log(file); // File 객체 출력
        }
      }, 'image/png');
    }
  }, []);
  useEffect(()=>{
    const timerId = setTimeout(()=>{
      // setIsTimer(false) 호출 시 컴포넌트 언마운트 됨
      setIsTimer(false);
    }, 5000)
    return () => clearTimeout(timerId);
  }, [])
  useEffect(() => {
    if (seconds == 5){
      setSeconds(4);
    }
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seconds]);

  const calculateDashArray = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const remaining = (seconds / 5) * circumference;
    return `${remaining} ${circumference}`;
  };

  return (
    <TimerContainer>
      <TimerSVG>
        <CircleBackground cx="50%" cy="50%" r="40" />
        <CircleProgress
          cx="50%"
          cy="50%"
          r="40"
          strokeDasharray={calculateDashArray()}
        />
      </TimerSVG>
      <TimerText>{seconds}</TimerText>
    </TimerContainer>
  );
};

export default CountdownTimer;
