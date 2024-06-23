import styled from 'styled-components';
import { Paper } from "@mui/material";

export const FileInput = styled.input`
    display: none;

`
export const ImageChangeLabel = styled.label`
    margin: 5px 0 20px 0;
    font-weight: bold;
    font-size: 13px;
    color: #0095f6;
    display: inline-block;
    cursor: pointer;
`;

export const ProfileCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;