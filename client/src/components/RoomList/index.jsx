import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {useState, useCallback} from 'react';
import { useMainSocket } from '../../contexts/MainSocketContext';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function RoomList({rooms}) {
    const socket = useMainSocket();
    const [roomName, setRoomName] = useState('');
    const changeRoomName = useCallback((e)=>{
        setRoomName(e.target.value);
    })
    const createRoom = useCallback(()=>{
      socket.emit('createRoom', roomName);
    })
  return (
    <TableContainer component={Paper}>
        <Typography variant = "h5">채팅방 목록</Typography>
        <Box>
        <TextField onChange = {changeRoomName} id="outlined-basic" label="방 이름" variant="outlined" />
        <Button onClick = {createRoom}>방 생성</Button>

        </Box>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>NO</TableCell>
            <TableCell align="right">방 이름</TableCell>
            <TableCell align="right">방장</TableCell>
            <TableCell align="right">입장</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
