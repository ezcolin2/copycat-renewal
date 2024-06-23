import Header from "../../layouts/Header";
import ProfileCard from "../../components/ProfileCard";
import { Outer, Layout } from "./styles";
import { Grid } from "@mui/material";
import { useState } from "react";
import RoomList from "../../components/RoomList";
import { MainSocketProvider } from "../../contexts/MainSocketContext";

const Main = () => {
  const [rooms, setRooms] = useState([]);
  return (
    <MainSocketProvider>
      <Outer>
        <Header />
        <Grid component={Layout} container spacing={2}>
          <Grid item xs={4}>
            <ProfileCard />
          </Grid>
          <Grid item xs={8}>
            <RoomList rooms={rooms} />
          </Grid>
        </Grid>
      </Outer>
    </MainSocketProvider>
  );
};
export default Main;
