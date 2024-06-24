import React from "react";
import OpenViduVideoComponent from "./OvVideo";
import {
  StreamComponentContainer,
  StreamComponentOverlay,
  NameTag,
} from "./styles";

const UserVideoComponent = ({ streamManager }) => {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager !== undefined ? (
        <StreamComponentContainer>
          <OpenViduVideoComponent streamManager={streamManager} />
          <StreamComponentOverlay>
            <NameTag>{getNicknameTag()}</NameTag>
          </StreamComponentOverlay>
        </StreamComponentContainer>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
