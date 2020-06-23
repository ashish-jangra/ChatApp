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
import UpdateProfile from './Home/UpdateProfile';
import LoginPage from "../Components/Landing/LoginPage";
import { connect } from "react-redux";
import { getAuthVerified } from "./serviceClass";
import { hostURL } from "./config";

class App extends Component {
  constructor(props) {
    super(props);
    themes.whatsApp.palette.type = "light";
    console.log("theme", createMuiTheme(themes.whatsApp))
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
  connectToSocket = () => {
    this.setState({
      socket: io(hostURL, {
        query: "authData=" + JSON.stringify(this.props.authData),
      }),
    });
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
            <Route
              path="/"
              render={(props) => (
                <LandingPage {...props} socket={this.state.socket} />
              )}
            />
          </Switch>
        </BrowserRouter>
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
});

const mapDispatchToProps = (dispatch) => ({
  setAuthData: (authData) => dispatch({ type: "SET_AUTH_DATA", authData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
