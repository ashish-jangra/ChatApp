import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Box, Hidden } from '@material-ui/core';
import Home from './Home/Home';
import Chat from './Chat/Chat';
import io from 'socket.io-client';
import themes from './themes';
import Contacts from './Contacts/Contacts';
import LandingPage from './Landing/LandingPage';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ProfilePage from './ProfilePage/ProfilePage';
import AddContact from '../Components/Contacts/AddContact';
import LoginPage from '../Components/Landing/LoginPage';

class App extends Component {
	constructor(props) {
		super(props);
		themes.whatsApp.palette.type = "light"
		this.state = {
			socket: io('http://192.168.43.11:4000')
		};
	}
	componentDidMount() {
		// this.state.socket.emit('chat');
	}
	render() {
		return (
			<MuiThemeProvider theme={createMuiTheme(themes.whatsApp)}>
				<BrowserRouter>
					<Switch>
						<Route exact path="/login" component={LoginPage} />
						<Route
							exact
							path="/chat/:contact"
							render={(props) => <Chat {...props} socket={this.state.socket} />}
						/>
            <Route exact path="/contacts" render={(props)=> <Contacts {...props} />} />
						<Route exact path="/profile" render={(props)=> <ProfilePage {...props} />} />
						<Route exact path="/addContact" render={(props)=> <AddContact {...props} />} />
						<Route path="/" render={(props) => <LandingPage {...props} socket={this.state.socket} />} />
					</Switch>
				</BrowserRouter>
			</MuiThemeProvider>
		);
	}
}

export default App;
