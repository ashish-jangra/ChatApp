import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Chat from "./Chat/Chat";
import io from "socket.io-client";
import themes from "./themes";
import Contacts from "./Contacts/Contacts";
import LandingPage from "./Landing/LandingPage";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ProfilePage from "./ProfilePage/ProfilePage";
import AddContact from "../Components/Contacts/AddContact";
import LoginPage from "../Components/Landing/LoginPage";
import { connect } from "react-redux";
import { getAuthVerified } from "./serviceClass";

class App extends Component {
  constructor(props) {
    super(props);
    themes.whatsApp.palette.type = "light";
    let cookies = this.parseCookie(document.cookie);
    console.log("[App] cookies", cookies)
    if(cookies.userId){
      this.props.setAuthData({
        userId: cookies.userId,
        username: cookies.name,
        email: cookies.email
      })
      getAuthVerified()
      .then(authData => {
        if(!authData.isAuth)
          throw "Not authenticated";
      })
      .catch(err => {
        console.log("error verifying auth", err);
        this.props.setAuthData({
          userId: undefined,
          name: undefined,
          email: undefined
        })
      })
    }
  }
  parseCookie = cookieString => {
    cookieString = cookieString || "";
    let cookieObj = {};
    cookieString.split(';').map(cookie => {
      let [key, value] = cookie.split('=');
      if(!key || !value)
        return;
      key = key.trim();
      value = value.trim();
      cookieObj[key] = value;
    })
    return cookieObj;
  }
  componentDidMount() {
    // this.state.socket.emit('chat');
	}
	componentDidUpdate(prevProps){
		if(!prevProps.authData.email && this.props.authData.email){
			this.setState({
				socket: io("http://192.168.43.11:4000", {query: 'authData=' + JSON.stringify(this.props.authData)})
			})
		}
	}
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(themes.whatsApp)}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            {(!this.props.authData.username || !this.props.authData.email) && (
              <Redirect to="/login" />
            )}
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
              exact
              path="/profile"
              render={(props) => <ProfilePage {...props} />}
            />
            <Route
              exact
              path="/addContact"
              render={(props) => <AddContact {...props} />}
            />
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
    authToken: state.authToken
  },
});

const mapDispatchToProps = dispatch => ({
  setAuthData: (authData) => dispatch({type: 'SET_AUTH_DATA', authData})
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
