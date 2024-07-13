import ProfileCard from "../../components/UserProfileCard";
import { Grid } from "@mui/material";
import RoomList from "../../components/RoomList";
import { MainSocketProvider } from "../../contexts/MainSocketContext";
import MainHeader from "../../components/MainHeader";
import { useOnlyAuthenticated } from "../../hooks/useAuth";
const Main = () => {
  useOnlyAuthenticated('/');
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
