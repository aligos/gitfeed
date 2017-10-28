import React from "react";
import styled from "styled-components";
import {
  space,
  width,
  fontSize,
  fontWeight,
  color,
  borderColor,
  borderRadius,
  justifyContent
} from "styled-system";

const Box = styled.div`
  display: flex;
  ${space} ${width} ${fontSize} ${color} ${justifyContent};
`;

const linkStyle = {
  fontSize: "14px",
  color: "black",
  fontWeight: "bold",
  fontFamily: "inherit",
  textDecoration: "none",
  marginRight: "5px",
  marginLeft: "5px"
};

const FeedList = ({ count, loading, logged, dispatch, user }) => {
  return [
    <Box key={1} width={(1, "300px")} py={5} style={{borderBottom: '1px solid #efefef'}} justify="center">
      {user.login}
    </Box>,
    <Box key={2} width={(1, "300px")} py={5} style={{borderBottom: '1px solid #efefef'}} justify="left">
      <a href="#" style={linkStyle}>
        aligos
      </a>{" "}
      stared{" "}
      <a href="#" style={linkStyle}>
        awanz/animer
      </a>
    </Box>,
    <Box key={3} width={(1, "300px")} py={5} style={{borderBottom: '1px solid #efefef'}} justify="left">
      <a href="#" style={linkStyle}>
        aligos
      </a>{" "}
      stared{" "}
      <a href="#" style={linkStyle}>
        awanz/animer
      </a>
    </Box>,
    <Box key={4} width={(1, "300px")} py={5} style={{borderBottom: '1px solid #efefef'}} justify="left">
      <a href="#" style={linkStyle}>
        aligos
      </a>{" "}
      stared{" "}
      <a href="#" style={linkStyle}>
        awanz/animer
      </a>
    </Box>,
    <Box key={5} width={(1, "300px")} py={5} style={{borderBottom: '1px solid #efefef'}} justify="left">
      <a href="#" style={linkStyle}>
        aligos
      </a>{" "}
      stared{" "}
      <a href="#" style={linkStyle}>
        awanz/animer
      </a>
    </Box>
  ];
};

export default FeedList;
