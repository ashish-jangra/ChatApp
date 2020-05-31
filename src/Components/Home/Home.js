import React, { Component } from "react";
import {
  MenuList,
  MenuItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Grid,
  Box,
	Badge,
} from "@material-ui/core";
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { getContacts } from "../serviceClass";
import {getHomeTimeString} from '../Utility/CommonFunctions';

const styles = (theme) => ({
  overflowText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  contactName: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "capitalize",
	},
	secondaryText: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		color: 'gray',
		fontSize: '0.75rem'
	},
  bold: {
    fontWeight: "bold",
  },
  unreadMsgTime: {
    color: theme.palette.secondary.main,
	},
	unreadMsg: {
		color: '#000'
	}
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      presentableContacts: [],
    };
  }
  handleSelectContact = (contact) => {
    this.props.history.push(`/chat/${contact.email}`, {
      contact,
    });
  };
  handleOpenContacts = () => {
    this.props.history.push("/contacts");
  };
  sortByRecentMsgs = (user1, user2) => {
    let lastMsg1 = user1.chats[user1.chats.length - 1];
    let lastMsg2 = user2.chats[user2.chats.length - 1];
    if (lastMsg1.sent || lastMsg2.sent) {
      if (!lastMsg1.sent) return 1;
      if (!lastMsg2.sent) return -1;
      return lastMsg1.sent > lastMsg2.sent
        ? -1
        : lastMsg1.sent === lastMsg2.sent
        ? user1.name < user2.name
          ? -1
          : 1
        : 1;
    }
    return 0;
  };
  handleReceiveMessage = (data) => {
    // currently assuming personal maessage received
    console.log("[home]received a message, display on UI");
    let { contacts, presentableContacts } = this.state;
    let contact = presentableContacts.find((ct) => ct.email === data.from);
    if (!contact) {
      contact = contacts.find((ct) => ct.email === data.from);
      if (contact) {
        contact.unreadMessages = (contact.unreadMessages || 0) + 1;
        contact.chats.push(data);
        presentableContacts.push(contact);
        presentableContacts.sort(this.sortByRecentMsgs);
        this.setState({
          contacts,
          presentableContacts,
        });
      } else {
        this.getContactsReady();
      }
    } else {
      contact.unreadMessages = (contact.unreadMessages || 0) + 1;
      contact.chats.push(data);
      presentableContacts.sort(this.sortByRecentMsgs);
      this.setState({
        presentableContacts,
      });
    }
  };
  addSocketEventListeners = () => {
    let { socket } = this.props;
    if (!socket) return;
    socket.on("receiveMessage", this.handleReceiveMessage);
  };
  getContactsReady = () => {
    getContacts()
      .then((contacts) => {
        // console.log("[home] received contacts", contacts)
        let presentableContacts = contacts.filter(
          (contact) => contact.chats.length > 0
        );
        presentableContacts.sort(this.sortByRecentMsgs);
        this.setState({
          contacts: contacts || [],
          presentableContacts,
        });
      })
      .catch((err) => {
        console.log("[Home]error getting contacts list", err);
      });
  };
  componentDidMount() {
    this.addSocketEventListeners();
    this.getContactsReady();
  }
  componentWillUnmount() {
    if (this.props.socket)
      this.props.socket.removeEventListener(
        "receiveMessage",
        this.handleReceiveMessage
      );
  }
  render() {
    const { classes } = this.props;
    return (
      <MenuList>
        {this.state.presentableContacts.map((contact, index) => (
          <Box key={index}>
            <MenuItem onClick={() => this.handleSelectContact(contact)}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  {contact.type === "group" ? <GroupIcon /> : <PersonIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                classes={{
                  secondary: `${classes.overflowText} ${
                    contact.unreadMessages && classes.unreadMsg
                  }`,
                }}
                primary={(<Grid container>
									<Grid className={`${classes.contactName} ${contact.unreadMessages && classes.bold}`} item xs={9}>
										{contact.name}
									</Grid>
									<Grid className={`${classes.secondaryText} ${contact.unreadMessages && classes.unreadMsgTime}`} item xs={3}>
										{getHomeTimeString(contact.chats[contact.chats.length - 1].sent)}
									</Grid>
								</Grid>)}
                secondary={
									(<Grid container>
										<Grid className={`${classes.overflowText} ${contact.unreadMessages && classes.unreadMsg}`} item xs={contact.unreadMessages ? 11 : 12}>
                  		{contact.chats[contact.chats.length - 1].msg}
										</Grid>
										{contact.unreadMessages && (
											<Grid item xs={1}>
												<Badge badgeContent={contact.unreadMessages} color="secondary" />
											</Grid>
										)}
									</Grid>)
                }
              />
            </MenuItem>
            {index !== this.state.presentableContacts.length - 1 && <Divider />}
          </Box>
        ))}
      </MenuList>
    );
  }
}

export default withStyles(styles)(Home);
