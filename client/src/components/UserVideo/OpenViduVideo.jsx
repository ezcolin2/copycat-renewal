import React, { useEffect, useRef, forwardRef } from "react";
import { Video } from "./styles";
import SkeletonCanvas from "../SkeletonCanvas";
import { useRefContext } from "../../contexts/RefContext";

const OpenViduVideo = ({ streamManager }) => {
  const {videoRef} = useRefContext();
  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <>
      <Video autoPlay={true} ref={videoRef} />
      {<SkeletonCanvas />}
    </>
  );
};

export default OpenViduVideo;
