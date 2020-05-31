import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Box, Container, Typography, InputBase } from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import ChatHeader from '../Header/ChatHeader';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden auto',
		height: '100%',
		paddingTop: '16px',
		background: 'lightgray',
		backgroundSize: 'contain'
	},
	messageContainer: {
		marginBottom: '8px',
	},
	myMessageBox: {
		wordBreak: 'break-word',
		maxWidth: '80%',
		padding: '8px 12px',
		borderRadius: '8px 0 8px 8px',
		backgroundColor: '#cfe9ba',
	},
	otherMessageBox: {
		wordBreak: 'break-word',
		maxWidth: '80%',
		padding: '8px 12px',
		borderRadius: '0px 8px 8px 8px',
		backgroundColor: 'white',
	},
	chatFeedback: {
		position: 'relative',
		bottom: 0,
		paddingLeft: '8px',
		display: 'block',
		textAlign: 'right',
		color: 'gray',
	},
	inputContainer: {
		position: 'sticky',
		padding: '6px 0',
		alignItems: 'flex-end',
		bottom: 0,
		left: 0,
		width: '100%',
		// border: '1px solid red',
		// boxSizing: 'border-box',
		display: 'flex',
		background: 'lightgray',
		// backgroundSize: 'contain',
	},
	textFieldContainer: {
		width: '100%',
		backgroundColor: 'white',
		borderRadius: '24px',
		padding: '0 20px',
		display: 'flex',
		alignItems: 'center',
		margin: '0 6px',
		minHeight: '48px',
	},
	textFieldRoot: {
		width: '100%',
		fontSize: '0.875rem'
	},
	fab: {
		padding: '12px',
		marginRight: '6px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.palette.primary.main,
		borderRadius: '200px',
		color: 'white',
	},
	noUnderLine: {
		borderBottom: 'none !important',
		'&:before': {
			borderBottom: 'none',
		},
		'&:after': {
			borderBottom: 'none',
		},
		'&:hover': {
			borderBottom: 'none',
		},
	},
});

class Chat extends Component {
	constructor(props) {
		super(props);
		console.log("histoary data", this.props.location.state)
		let contact = (this.props.location.state && this.props.location.state.contact) || {
			name: 'Loading...',
			email: 'anonymous@chatapp.com',
			chats: []
		};
		this.state = {
			contact
		};
		window.scrollTo(0, document.body.scrollHeight);
		this.inputRef = React.createRef();
	}
	handleMessageTextChange = (e) => {
		if(e.target.value.endsWith('\n'))
			return;
		this.setState({
			messageText: e.target.value,
		});
	};
	formatNum = num => ("0"+num).slice(-2);
	getTimeString = (date) => {
		if(!date)
			date = new Date();
		else
			date = new Date(date);
		let hours = date.getHours()%12 || 12;
		let ampm = [' am', ' pm'][Math.floor(date.getHours()/12)];
		return this.formatNum(hours)+":"+this.formatNum(date.getMinutes())+ampm
	}
	handleMessageSend = () => {
		let message = this.state.messageText.trim();
		let contact = JSON.parse(JSON.stringify(this.state.contact));
		if(contact.type === 'group'){
			this.props.socket.emit('sendMessageInGroup', {
				groupName: this.props.match.params.contact,
				msg: message
			})
		}
		else{
			this.props.socket.emit('sendPersonalMessage', {
				to: this.state.contact.userId,
				msg: message,
				sent: new Date()
			})
		}
		if (contact.chats && Number.isInteger(contact.chats.length))
			contact.chats.push({
				from: this.props.authData.email,
				msg: message,
				// time: `${new Date().getHours()}:${new Date().getMinutes()}`
				sent: new Date(),
			});
		else
			contact.chats = [
				{
					from: this.props.authData.email,
					msg: this.state.messageText,
					// time: `${new Date().getHours()}:${new Date().getMinutes()}`
					sent: new Date(),
				},
			];
		this.setState({messageText: '', contact})
	};
	componentDidUpdate(prevProps, prevState) {
		this.inputRef.current && this.inputRef.current.focus();
	}
	handleKeyPress = (e) => {
		if (e.keyCode === 13) {
			if (this.state.messageText && this.state.messageText.trim()) {
				this.handleMessageSend();
			}
		}
	};
	componentDidMount(){
		const {socket} = this.props;
		socket.emit('joinRoom', {
			groupName: this.props.match.params.contact
		})
		socket.on('receiveMessage', (data)=>{
			let contact = this.state.contact;
			if(data.from !== contact.email)
				return;
			contact.chats.push({
				from: data.from,
				msg: data.msg
			})
			this.setState({
				contact
			})
		})
	}
	componentWillUnmount(){
		this.props.socket.off('test')
	}
	render() {
		const { classes} = this.props;
		return (
			<React.Fragment>
				<ChatHeader headerText={this.state.contact.name} isGroup={this.state.contact.type === 'group'} />
				<Container 
					className={classes.root} 
					// style={{ minHeight: `${window.innerHeight - (52 + 90)}px` }}
				>
					{this.state.contact &&
						this.state.contact.chats &&
						this.state.contact.chats[0] &&
						this.state.contact.chats.map((chat, index) => (
							<Box
								key={index}
								className={classes.messageContainer}
								display="flex"
								style={{ marginBottom: index === this.state.contact.chats.length - 1 ? '0px' : '8px' }}
								justifyContent={chat.from === this.props.authData.email ? 'flex-end' : 'flex-start'}
							>
								<Box className={chat.from === this.props.authData.email ? classes.myMessageBox : classes.otherMessageBox}>
									<Typography variant="body2">
										{chat.msg}
									</Typography>
									<Typography variant="caption" className={classes.chatFeedback}>
										{this.getTimeString(chat.sent)}
									</Typography>
								</Box>
							</Box>
						))}
				</Container>
				<Box className={classes.inputContainer}>
					<Box className={classes.textFieldContainer}>
						<InputBase
							inputRef={this.inputRef}
							autoFocus={true}
							multiline={true}
							rowsMax={6}
							onKeyUp={this.handleKeyPress}
							value={this.state.messageText}
							onChange={this.handleMessageTextChange}
							placeholder="Type message to send..."
							classes={{ root: classes.textFieldRoot}}
							type="text"
						/>
					</Box>
					<Box onClick={this.handleMessageSend} className={classes.fab}>
						<SendIcon />
					</Box>
				</Box>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	authData: {
		email: state.email
	}
})

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Chat));
