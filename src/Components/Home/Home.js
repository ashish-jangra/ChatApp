import React, { Component } from 'react';
import { MenuList, MenuItem, ListItemAvatar, Avatar, ListItemText, Divider, Fab, Box } from '@material-ui/core';
import { Person as PersonIcon, Chat as ChatIcon, Group as GroupIcon } from '@material-ui/icons';
import contacts from '../../Data/Contacts';
import { withStyles } from '@material-ui/core/styles';
import {getContacts} from '../serviceClass';

const styles = () => ({
	overflowText: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	contactName: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		textTransform: 'capitalize'
	}
});

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contacts: []
		}
	}
	handleSelectContact = (contact) => {
		this.props.history.push(`/chat/${contact.email}`, {
			contact
		});
  };
  handleOpenContacts = () => {
    this.props.history.push('/contacts')
	}
	componentDidMount(){
		getContacts()
			.then(contacts => {
				// console.log("[home] received contacts", contacts)
				this.setState({
					contacts: contacts || []
				})
			})
			.catch(err => {
				console.log("[Home]error getting contacts list", err);
			})
	}
	render() {
		const { classes } = this.props;
		return (
			<MenuList>
				{this.state.contacts.map((contact, index) => (
					<Box key={index}>
						<MenuItem onClick={() => this.handleSelectContact(contact)}>
							<ListItemAvatar>
								<Avatar className={classes.avatar}>
									{contact.type === 'group' ? <GroupIcon /> : <PersonIcon />}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								classes={{ primary: classes.contactName, secondary: classes.overflowText }}
								primary={contact.name}
								secondary={(contact.chats && contact.chats[0] && contact.chats[0].msg) || ""}
							/>
						</MenuItem>
						{index !== contacts.length-1 && <Divider />}
					</Box>
				))}
			</MenuList>
		);
	}
}

export default withStyles(styles)(Home);
