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

/**
 * 
 * @returns {JSX.Element} 현재 생성되어 있는 방 목록을 보여준다.
 */
export default function RoomList() {
  const navigate = useNavigate(); // 페이지 이동을 위한 함수
  const { socket, rooms } = useMainSocket(); // 전역적으로 관리 중인 소켓
  const [roomName, setRoomName] = useState(""); // 방 이름

  // 방 이름을 입력하는 함수.
  const changeRoomName = useCallback((e) => {
    setRoomName(e.target.value);
  });

  // 방을 생성하는 함수.
  const createRoom = useCallback(() => {
    socket.emit("createRoom", roomName);
  });

  // 방에 접속하는 함수.
  const enterRoom = useCallback((e)=>{
    navigate(`/rooms/${e.target.id}`);
  })

  // 방 목록을 보여준다.
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
