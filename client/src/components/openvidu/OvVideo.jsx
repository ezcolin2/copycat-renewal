import React, { useEffect, useRef } from "react";
import { Video } from "./styles";
import SkeletonCanvas from "../SkeletonCanvas";

const OpenViduVideoComponent = ({ streamManager }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <>
      <Video autoPlay={true} ref={videoRef} />
      {<SkeletonCanvas videoRef={videoRef} />}
    </>
  );
};

export default OpenViduVideoComponent;
