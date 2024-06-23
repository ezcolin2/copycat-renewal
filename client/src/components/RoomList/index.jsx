import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useState, useCallback } from "react";
import { useMainSocket } from "../../contexts/MainSocketContext";
import { useNavigate } from "react-router-dom";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function RoomList() {
  const { socket, rooms } = useMainSocket();
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const changeRoomName = useCallback((e) => {
    setRoomName(e.target.value);
  });
  const createRoom = useCallback(() => {
    socket.emit("createRoom", roomName);
  });
  const enterRoom = useCallback((e)=>{
    navigate(`/rooms/${e.target.id}`);
  })
  return (<div style = {{height: '600px', overflow: 'auto'}}>

    <TableContainer component={Paper}>
      <Typography variant="h5">채팅방 목록</Typography>
      <Box>
        <TextField
          onChange={changeRoomName}
          id="outlined-basic"
          label="방 이름"
          variant="outlined"
        />
        <Button onClick={createRoom}>방 생성</Button>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">NO</TableCell>
            <TableCell align="left">방 이름</TableCell>
            <TableCell align="left">방장</TableCell>
            <TableCell align="center">입장</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room, idx) => (
            <TableRow
              key={idx}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{idx + 1}</TableCell>
              <TableCell align="left">{room.name}</TableCell>
              <TableCell align="left">{room.master}</TableCell>
              <TableCell align="center">
                <Button id = {room._id} onClick = {enterRoom}>입장하기</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}
