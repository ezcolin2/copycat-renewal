import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { LogoImg } from "./styles";
/**
 * @typedef {function():void} OnClickFunction
 */
/**
 * @param {Object} props
 * @param {string} props.title 헤더의 중앙 문자열.
 * @param {string} props.btnText 우측 버튼 안 문자열.
 * @param {OnClickFunction} props.onClickBtn 버튼 클릭 이벤트.
 * @returns {JSX.Element}
 */
const Header = ({ title, btnText, onClickBtn }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <LogoImg src={`${process.env.PUBLIC_URL}/copycat.png`} />
          <Typography>{title}</Typography>
          <Button color="inherit" onClick={onClickBtn}>
            {btnText}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
