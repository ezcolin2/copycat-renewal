import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { FileInput, ImageChangeLabel, ProfileCard } from "./styles";
import useUser from "../../hooks/useUser";
import { Spinner } from "../Spinner";

/**
 * 
 * @returns {JSX.Element} 유저 정보를 보여주는 프로필 카드
 */
const UserProfileCard =  () => {
  // 유저 정보를 가져오는 swr 커스텀 훅
  const { myInfo, isError, isLoading } = useUser();
  return (
    <ProfileCard style = {{height: '600px'}}>
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
              {!isLoading && !isError && myInfo.nickname}
            </Typography>
            <Typography>{`${!isLoading && !isError && myInfo.matches}전 ${
              !isLoading && !isError && myInfo.win
            }승 ${!isLoading && !isError && myInfo.lose}패`}</Typography>
          </>
        )}
      </div>
    </ProfileCard>
  );
};

export default UserProfileCard;