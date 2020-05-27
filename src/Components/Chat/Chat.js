import React, { Component } from 'react';
import { Box, Container, Typography, TextField, InputBase } from '@material-ui/core';
import { Send as SendIcon, InsertEmoticon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import contacts from '../../Data/Contacts';
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
		borderRadius: '22px',
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
		let contact = contacts.find((item) => item.name === this.props.match.params.contact);
		this.state = {
			contact
		};
		window.scrollTo(0, document.body.scrollHeight);
	}
	handleMessageTextChange = (e) => {
		if(e.target.value.endsWith('\n'))
			return;
		this.setState({
			messageText: e.target.value,
		});
	};
	handleMessageSend = () => {
		let message = this.state.messageText.trim();
		let contact = JSON.parse(JSON.stringify(this.state.contact));
		if(contact.type === 'group'){
			this.props.socket.emit('sendMessageInGroup', {
				groupName: this.props.match.params.contact,
				message
			})
		}
		if (contact.chats && Number.isInteger(contact.chats.length))
			contact.chats.push({
				from: 'me',
				msg: message,
				// time: `${new Date().getHours()}:${new Date().getMinutes()}`
				time: '11:06AM',
			});
		else
			contact.chats = [
				{
					from: 'me',
					msg: this.state.messageText,
					// time: `${new Date().getHours()}:${new Date().getMinutes()}`
					time: '11:06AM',
				},
			];
		this.setState({messageText: '', contact})
	};
	componentDidUpdate(prevProps, prevState) {
		window.scrollTo(0, document.body.scrollHeight);
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
		socket.on('message', (data)=>{
			let contact = JSON.parse(JSON.stringify(this.state.contact))
			if(contact.chats && Number.isInteger(contact.chats.length))
				contact.chats.push(data)
			else
				contact.chats = [data]
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
						this.state.contact.chats.length &&
						this.state.contact.chats.map((chat, index) => (
							<Box
								key={index}
								className={classes.messageContainer}
								display="flex"
								style={{ marginBottom: index === this.state.contact.chats.length - 1 ? '0px' : '8px' }}
								justifyContent={chat.from === 'me' ? 'flex-end' : 'flex-start'}
							>
								<Box className={chat.from === 'me' ? classes.myMessageBox : classes.otherMessageBox}>
									<Typography variant="body2">
										{chat.msg}
									</Typography>
									<Typography variant="caption" className={classes.chatFeedback}>
										{chat.time}
									</Typography>
								</Box>
							</Box>
						))}
				</Container>
				{/* <Box style={{height: '90px', background: 'lightgray'}} /> */}
				<Box className={classes.inputContainer}>
					<Box className={classes.textFieldContainer}>
						<InputBase
							multiline={true}
							rowsMax={4}
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

export default withStyles(styles, { withTheme: true })(Chat);
