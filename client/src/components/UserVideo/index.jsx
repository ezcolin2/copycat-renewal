import React, { useRef } from "react";
import OpenViduVideo from "./OpenViduVideo";
import {
  StreamComponentContainer,
  StreamComponentOverlay,
  NameTag,
} from "./styles";
import CountdownTimer from "../CountdownTimer";
import { useRoomSocket } from "../../contexts/RoomSocketContext";
import { useRefContext } from "../../contexts/RefContext";
import { RefContextProvider } from "../../contexts/RefContext";

const UserVideo = ({ streamManager }) => {
  const { _, isTimer, setIsTimer, timerNickname } = useRoomSocket();
  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <RefContextProvider>
      <div>
        {streamManager !== undefined ? (
          <StreamComponentContainer>
            {isTimer && timerNickname === getNicknameTag() && (
              <CountdownTimer />
            )}
            <OpenViduVideo streamManager={streamManager} />
            <StreamComponentOverlay>
              <NameTag>{getNicknameTag()}</NameTag>
            </StreamComponentOverlay>
          </StreamComponentContainer>
        ) : null}
      </div>
    </RefContextProvider>
  );
};

export default UserVideo;
