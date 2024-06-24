import React, { useEffect, useRef } from 'react';
import {Video} from './styles';

const OpenViduVideoComponent = ({ streamManager }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return <Video autoPlay={true} ref={videoRef} />;
};

export default OpenViduVideoComponent;
