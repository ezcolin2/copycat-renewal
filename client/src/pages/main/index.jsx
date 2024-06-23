import Header from "../../layouts/Header";
import ProfileCard from "../../components/ProfileCard";
import { Outer, Layout } from "./styles";
import { Grid, Box } from "@mui/material";
import { useState } from "react";
import RoomList from "../../components/RoomList";
import { MainSocketProvider } from "../../contexts/MainSocketContext";

const Main = () => {
  const [rooms, setRooms] = useState([]);
  return (
    <MainSocketProvider>
      <Grid
      display="flex" flexDirection="column">
        <Header />
        <Grid container spacing={2} p= {2}>
          <Grid item xs={4}>
            <ProfileCard />
          </Grid>
          <Grid item xs={8}>
            <RoomList />
          </Grid>
        </Grid>
      </Grid>
    </MainSocketProvider>
  );
};
export default Main;
