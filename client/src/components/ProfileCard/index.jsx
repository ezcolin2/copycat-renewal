import { Paper, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { FileInput, ImageChangeLabel, ProfileCard } from "./styles";
import useUser from "../../hooks/useUser";
import { Spinner } from "../Spinner";

export default () => {
  const { myInfo, isError, isLoading } = useUser();
  return (
    <ProfileCard sx={{ width: "100%", height: "100%" }}>
      {isLoading && <Spinner />}
      <Avatar sx={{ width: 150, height: 150 }} />
      <div>
        <FileInput type="file" accept="image/*" id="profile-image" />
        <ImageChangeLabel htmlFor="profile-image">
          프로필 변경하기
        </ImageChangeLabel>
        {!isLoading && (
          <>
            <Typography variant="h4">
              {!isLoading && myInfo.nickname}
            </Typography>
            <Typography>{`${!isLoading && myInfo.matches}전 ${
              !isLoading && myInfo.win
            }승 ${!isLoading && myInfo.lose}패`}</Typography>
          </>
        )}
      </div>
    </ProfileCard>
  );
};
