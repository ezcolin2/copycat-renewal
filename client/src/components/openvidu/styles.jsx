import styled from 'styled-components';

export const Video = styled.video`
    width: 100%;
    height: auto;
    float: left;
    cursor: pointer;
`;

export const StreamComponentContainer = styled.div`
    position: relative;
`;

export const StreamComponentOverlay = styled.div`
    position: absolute;
    top: 0; 
    left: 0; 
    background: #f8f8f8;
    padding-left: 5px;
    padding-right: 5px;
    color: #777777;
    font-weight: bold;
    border-bottom-right-radius: 4px;
`;

export const NameTag = styled.p`
    margin: 0;
`;
