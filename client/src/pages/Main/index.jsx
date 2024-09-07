import ProfileCard from "../../components/UserProfileCard";
import { Grid } from "@mui/material";
import RoomList from "../../components/RoomList";
import { MainSocketProvider } from "../../contexts/MainSocketContext";
import MainHeader from "../../components/MainHeader";
const Main = () => {
  return (
    <MainSocketProvider>
      <Grid
      display="flex" flexDirection="column">
        <MainHeader />
        <Grid container spacing={2} p= {2}>
          <Grid item xs={4}>
            {<ProfileCard />}
          </Grid>
          <Grid item xs={8}>
            {<RoomList />}
          </Grid>
        </Grid>
      </Grid>
    </MainSocketProvider>
  );
};
export default Main;
