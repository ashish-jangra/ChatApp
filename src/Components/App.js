import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Chat from "./Chat/Chat";
import io from "socket.io-client";
import themes from "./themes";
import Contacts from "./Contacts/Contacts";
import LandingPage from "./Landing/LandingPage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProfilePage from "./ProfilePage/ProfilePage";
import AddContact from "./Contacts/AddContact";
import UpdateProfile from "./Home/UpdateProfile";
import LoginPage from "../Components/Landing/LoginPage";
import { connect } from "react-redux";
import { getAuthVerified } from "./serviceClass";
import { hostURL } from "./config";
import Call from "./Calls/Call";
import { Dialog, Typography, Slide, Box, Card, IconButton } from "@material-ui/core";
import { CallEnd, Phone } from "@material-ui/icons";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomingCall: false
    }
    themes.whatsApp.palette.type = "light";
    console.log("theme", createMuiTheme(themes.whatsApp));
    let cookies = this.parseCookie(document.cookie);
    console.log("[App] cookies", cookies);
    if (cookies.userId) {
      this.props.setAuthData({
        userId: cookies.userId,
        username: cookies.name,
        email: cookies.email,
      });
      getAuthVerified()
        .then((response) => {
          console.log("returned authdata", response);
          if (!response.isAuth || !response.authData)
            throw Error("Not authenticated");
          this.props.setAuthData({
            username: response.authData.name,
            userId: response.authData.userId,
            email: response.authData.email,
            authToken: response.authData.authToken,
          });
        })
        .catch((err) => {
          console.log("error verifying auth", err.message);
          this.props.setAuthData({
            userId: undefined,
            name: undefined,
            email: undefined,
          });
        });
    }
  }
  parseCookie = (cookieString) => {
    cookieString = cookieString || "";
    let cookieObj = {};
    cookieString.split(";").map((cookie) => {
      let [key, value] = cookie.split("=");
      if (!key || !value) return;
      key = key.trim();
      value = value.trim();
      cookieObj[key] = value;
    });
    return cookieObj;
  };
  addEventListeners = (socket) => {
    socket.on('callInvitation', (callData, sendAck) => {
      this.setState({
        incomingCall: true,
      })
      this.props.setCallData({
        userId: callData.userId,
        email: callData.email,
        name: callData.name,
        signalData: callData.signalData
      })
      this.sendAck = sendAck;
    })
  }
  connectToSocket = () => {
    let socket = io(hostURL, {
      query: "authData=" + JSON.stringify(this.props.authData),
    })
    this.setState({
      socket,
      // incomingCall: true
    });
    this.addEventListeners(socket);
  };
  componentDidMount() {
    // this.state.socket.emit('chat');
    if (this.props.authData && this.props.authData.authToken) {
      this.connectToSocket();
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.authData.authToken && this.props.authData.authToken) {
      this.connectToSocket();
    }
  }
  acceptCall = () => {
    this.setState({
      incomingCall: false
    })
    this.props.setCallData({
      // userId: 
      initiator: false,
      active: true
    })
  }
  declineCall = () => {
    this.setState({
      incomingCall: false
    })
    this.sendAck(null)
  }
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(themes.whatsApp)}>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/login"
              render={(props) => {
                if (this.props.authData && this.props.authData.authToken) {
                  return <Redirect to="/" />;
                }
                return <LoginPage {...props} />;
              }}
            />
            {(!this.props.authData.username ||
              !this.props.authData.authToken) && <Redirect to="/login" />}
            <Route
              exact
              path="/chat/:contact"
              render={(props) => <Chat {...props} socket={this.state.socket} />}
            />
            <Route
              exact
              path="/contacts"
              render={(props) => <Contacts {...props} />}
            />
            <Route
              path="/profile/:userId"
              render={(props) => <ProfilePage {...props} />}
            />
            <Route
              exact
              path="/addContact"
              render={(props) => <AddContact {...props} />}
            />
            <Route exact path="/updateProfile" component={UpdateProfile} />
            <Route path="/call/:userId" component={Call} />
            <Route
              path="/"
              render={(props) => (
                <LandingPage {...props} socket={this.state.socket} />
              )}
            />
          </Switch>
        </BrowserRouter>
        {this.props.callData.active && <Call sendAck={this.sendAck} socket={this.state.socket} />}
        <Slide in={this.state.incomingCall} direction="down">
          <Card
            style={{
              position: "fixed",
              zIndex: "5000",
              top: "8px",
              left: "8px",
              right: "8px",
              padding: "12px",
              borderRadius: "6px",
              background: "#fff"
            }}
          >
            <Box style={{display: "flex"}}>
              <IconButton onClick={this.declineCall} style={{background: "red", color: "white"}}>
                <CallEnd fontSize="small" />
              </IconButton>
              <Box style={{display: "flex", flexDirection: "column", width: "100%"}}>
                <Typography variant="body1" style={{textAlign: "center", width: "100%"}}>
                  {this.props.callData.name}
                </Typography>
                <Typography variant="body2" style={{textAlign: "center", width: "100%"}}>
                  {this.props.callData.email}
                </Typography>
              </Box>
              <IconButton onClick={this.acceptCall} style={{background: "green", color: "white"}}>
                <Phone fontSize="small" />
              </IconButton>
            </Box>
          </Card>
        </Slide>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  authData: {
    username: state.username,
    email: state.email,
    userId: state.userId,
    authToken: state.authToken,
  },
  callData: {
    userId: state.callData.userId,
    name: state.callData.name,
    email: state.callData.email,
    active: state.callData.active,
  },
});

const mapDispatchToProps = (dispatch) => ({
  setAuthData: (authData) => dispatch({ type: "SET_AUTH_DATA", authData }),
  setCallData: (callData) => dispatch({ type: "SET_CALL_DATA", callData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
