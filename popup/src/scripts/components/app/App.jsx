import React, { Component } from "react";
import { connect } from "react-redux";
import { tokenFetcher, getUserInfo, getUserFeeds } from "./auth";
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
import Spinner from "./Spinner";
import FeedList from "./FeedList";

const Box = styled.div`
  display: flex;
  ${space} ${width} ${fontSize} ${color} ${justifyContent};
`;

const Button = styled.button`
  ${color} ${fontSize} ${borderColor} ${borderRadius} ${space} ${fontWeight};
`;

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener("click", () => {
      this.props.dispatch({
        type: "ADD_COUNT"
        // type: "FETCH_FEEDS"
      });
      console.log(this.props);
    });
  }

  GitLogIn(props) {
    props.dispatch({
      type: "LOADING"
    });
    tokenFetcher.getToken(true, function(error, access_token) {
      if (error) {
        console.log(error);
      } else {
        props.dispatch({
          type: "LOGGED"
        });
        getUserInfo(true, props);
        getUserFeeds(true, props);
      }
    });
    setTimeout(() => {
      props.dispatch({
        type: "LOADING"
      });
    }, 3000);
  }

  render() {
    if (this.props.loading) {
      return (
        <Box width={(1, "300px")} justify="center">
          <Spinner />
        </Box>
      );
    } else if (this.props.logged) {
      return <FeedList {...this.props} />;
    } else {
      return [
        <Box key={1} width={(1, "300px")} justify="center">
          <h1>GitFeed</h1>
        </Box>,
        <Box key={2} width={(1, "300px")} justify="center">
          <Button
            style={{ border: "1px solid #485058" }}
            color={"white"}
            bg={"#24292e"}
            borderRadius={3}
            px={3}
            py={"5px"}
            fontSize={16}
            fontWeight="bold"
            onClick={() => this.GitLogIn(this.props)}
          >
            <svg
              aria-hidden="true"
              color="white"
              style={{ fill: "currentColor" }}
              height="16"
              version="1.1"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>{" "}
            Login
          </Button>
        </Box>,
        <Box key={3} width={(1, "300px")} justify="center">
          <p>You need to login</p>
        </Box>
      ];
    }
  }
}

const mapStateToProps = state => {
  return {
    count: state.count,
    loading: state.loading,
    logged: state.logged,
    user: state.user
  };
};

export default connect(mapStateToProps)(App);
