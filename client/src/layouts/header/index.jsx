import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { LogoImg } from './styles';
import useUser from '../../hooks/useUser';

const Header = ({title, btnText, onClickBtn}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="">
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <LogoImg src = {`${process.env.PUBLIC_URL}/copycat.png`}/>
          <Typography>
            {title} 
          </Typography>
          <Button color="inherit" onClick = {onClickBtn}>{btnText}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;