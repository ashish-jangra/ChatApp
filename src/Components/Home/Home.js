import React, { Component, Fragment } from "react";
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
import {connect} from 'react-redux';
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Image,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { getContacts, getDateObject } from "../serviceClass";
import {getHomeTimeString} from '../Utility/CommonFunctions';

const styles = (theme) => ({
  overflowText: {
    display: "flex",
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
  },
  gridContainer: {
    width: "100%",
    display: "flex"
  },
  item1: {
    width: "8.33%"
  },
  item11: {
    width: "91.66%"
  },
  item12: {
    width: "100%"
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      return getDateObject(lastMsg1.sent).getTime() > getDateObject(lastMsg2.sent).getTime()
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
    let {from} = data;
    this.props.addChat({
      contact: from,
      incUnread: true,
      msg: data
    })
    let presentableContacts = this.getPresentableContacts(this.props.contacts);
    this.setState({
      presentableContacts,
      updated: true
    })
  };
  addSocketEventListeners = () => {
    let { socket } = this.props;
    if (!socket) return;
    socket.on("receiveMessage", this.handleReceiveMessage);
  };
  getPresentableContacts = contacts => {
    let presentableContacts = contacts.filter(
      (contact) => contact.chats.length > 0
    );
    presentableContacts.sort(this.sortByRecentMsgs);
    return presentableContacts;
  }
  getContactsReady = () => {
    if(this.props.contacts.length){
      let presentableContacts = this.getPresentableContacts(this.props.contacts);
      this.setState({
        presentableContacts
      });
      return;
    }
    getContacts()
      .then((contacts) => {
        // console.log("[home] received contacts", contacts)
        this.props.setContacts(contacts);
        let presentableContacts = this.getPresentableContacts(contacts);
        this.setState({
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
    console.log("unmounting home.js")
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
									(<span className={classes.gridContainer}>
										<span className={`${classes.overflowText} ${contact.unreadMessages && classes.unreadMsg} ${contact.unreadMessages ? classes.item11 : classes.item12}`}>
                  		{contact.chats[contact.chats.length - 1].type === 'img' ? <Fragment> <Image fontSize="small" />&nbsp;Photo</Fragment> : contact.chats[contact.chats.length - 1].msg}
										</span>
										{contact.unreadMessages > 0 && (
											<span className={classes.item1}>
												<Badge badgeContent={contact.unreadMessages} color="secondary" />
											</span>
										)}
									</span>)
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

const mapStateToProps = state => ({
  contacts: state.contacts
})

const mapDispatchToProps = dispatch => ({
  setContacts: (contacts)=> dispatch({type: 'SET_CONTACTS', contacts}),
  addChat: (payload) => dispatch({type: 'ADD_CHAT', ...payload}),
  setUnreadMsg: (contact, count) => dispatch({type: 'SET_UNREAD_MESSAGE', contact, count})
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
