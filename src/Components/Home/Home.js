import React, { Component } from 'react';
import { MenuList, MenuItem, ListItemAvatar, Avatar, ListItemText, Divider, Fab, Box } from '@material-ui/core';
import { Person as PersonIcon, Chat as ChatIcon, Group as GroupIcon } from '@material-ui/icons';
import contacts from '../../Data/Contacts';
import { withStyles } from '@material-ui/core/styles';
import HomeHeader from '../Header/HomeHeader';

const styles = () => ({
	overflowText: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	}
});

class Home extends Component {
	constructor(props) {
		super(props);
	}
	handleSelectContact = (contact) => {
		this.props.history.push(`/chat/${contact.name}`);
  };
  handleOpenContacts = () => {
    this.props.history.push('/contacts')
  }
	render() {
		const { classes } = this.props;
		return (
			<MenuList>
				{contacts.map((contact, index) => (
					<Box key={index}>
						<MenuItem onClick={() => this.handleSelectContact(contact)}>
							<ListItemAvatar>
								<Avatar className={classes.avatar}>
									{contact.type === 'group' ? <GroupIcon /> : <PersonIcon />}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								classes={{ primary: classes.overflowText, secondary: classes.overflowText }}
								primary={contact.name}
								secondary={contact.chats && contact.chats.length && contact.chats[0].msg}
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
