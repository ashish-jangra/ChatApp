import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import SwipeableViews from "react-swipeable-views";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Fab,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { MoreVert, Chat as ChatIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import Home from "../Home/Home";
import Status from "../Home/Status";
import Calls from "../Home/Calls";

const styles = (theme) => {
  return {
    appbar: {
      textAlign: "center",
      top: 0,
      left: "auto",
      right: 0,
      position: "sticky",
    },
    toolbar: {
      textAlign: "center",
      padding: "8px 0",
      maxHeight: "36px",
      minHeight: "36px",
    },
    heading: { padding: "0 16px" },
    menuPaper: {
      position: "fixed",
			top: "6px !important",
			left: "auto !important",
			right: "6px !important",
			width: "fit-content"
    },
    avatarImage: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "40px",
      width: "40px",
      padding: "0 8px",
      marginLeft: 0,
      marginRight: "6px",
      background: "white",
      color: "gray",
      borderRadius: "200px",
    },
    iconContainer: {
      color: theme.palette.primary.contrastText,
      paddingRight: "8px",
      paddingLeft: 0,
    },
    videoIcon: {
      color: theme.palette.primary.contrastText,
      paddingRight: "8px",
    },
    callIcon: {
      color: theme.palette.primary.contrastText,
      paddingRight: "0px",
    },
    moreIcon: {
      color: theme.palette.primary.contrastText,
      position: "absolute",
      right: 0,
      top: 0,
    },
    tabs: {
      justifyContent: "center",
    },
    tab: {
      width: "33.33%",
    },
    fab: {
      position: "fixed",
      bottom: "12px",
      right: "12px",
    },
    componentContainer: {
      minHeight: "100%",
    },
  };
};

class LandingPage extends Component {
  constructor(props) {
    super(props);
    console.log("landing page");
    this.state = {
      activeTab: ["/", "/status", "/calls"].indexOf(
        this.props.location.pathname
      ),
      openSettingsMenu: false,
      menuAnchorEl: null
    };
  }
  handleGoBack = () => {
    this.props.history.goBack();
  };
  handleTabClick = (newTabIndex) => {
    if (this.state.activeTab !== newTabIndex) {
      this.setState({
        activeTab: newTabIndex,
      });
    }
  };
  handleOpenContacts = () => {
    this.props.history.push("/contacts");
  };
  handleOpenSettingsMenu = e => {
    this.setState({ 
      openSettingsMenu: true,
      menuAnchorEl: e.currentTarget
    });
  }
	handleCloseSettingsMenu = () => this.setState({ openSettingsMenu: false });
	handleProfileUpdate = () => {
		this.props.history.push('/updateProfile')
  }
  handleReceiveMessage = (data) => {
    // currently assuming personal maessage received
    console.log("[landingpage]received a message, display on UI");
    let {from} = data;
    this.props.addChat({
      contact: from,
      incUnread: true,
      msg: data
    })
    this.setState({
      updated: true
    })
  };
  handleMessagesSeen = (data) => {
    console.log("msgs seen", data)
    this.props.markMessagesSeen(data);
    this.setState({
      updated: true
    })
  }
  addSocketEventListeners = () => {
    let { socket } = this.props;
    if (!socket) return;
    socket.on("receiveMessage", this.handleReceiveMessage);
    socket.on("msgsSeen", this.handleMessagesSeen);
  };
  removeSocketEventListeners = () => {
    let { socket } = this.props;
    if (!socket) return;
    socket.removeEventListener("receiveMessage", this.handleReceiveMessage);
    socket.removeEventListener("msgsSeen", this.handleMessagesSeen);
  }
  componentDidMount(){
    this.addSocketEventListeners();
  }
  componentWillUnmount(){
    this.removeSocketEventListeners();
  }
  render() {
    const { classes, ...remProps } = this.props;
    return (
      <Fragment>
        <AppBar className={classes.appbar}>
          <Toolbar variant="dense" className={classes.toolbar}>
            <Typography variant="h6" className={classes.heading}>
              WhatsApp
            </Typography>
            <IconButton
              onClick={this.handleOpenSettingsMenu}
              className={classes.moreIcon}
            >
              <MoreVert />
            </IconButton>
          </Toolbar>
          <Tabs
            indicatorColor="secondary"
            value={this.state.activeTab}
            classes={{ flexContainer: classes.tabs }}
          >
            <Tab
              classes={{ root: classes.tab }}
              label="Chats"
              onClick={() => this.handleTabClick(0)}
            />
            <Tab
              classes={{ root: classes.tab }}
              label="Status"
              onClick={() => this.handleTabClick(1)}
            />
            <Tab
              classes={{ root: classes.tab }}
              label="Calls"
              onClick={() => this.handleTabClick(2)}
            />
          </Tabs>
        </AppBar>
        <Menu
          anchorEl={this.state.menuAnchorEl}
          classes={{ paper: classes.menuPaper }}
          open={this.state.openSettingsMenu}
          onClose={this.handleCloseSettingsMenu}
        >
          <MenuItem onClick={this.handleProfileUpdate}>Update Profile</MenuItem>
					<MenuItem>Settings</MenuItem>
        </Menu>
        <SwipeableViews
          index={this.state.activeTab}
          onChangeIndex={(newIndex) => {
            this.setState({
              activeTab: newIndex,
            });
          }}
          style={{ height: "100%" }}
        >
          <Box className={classes.componentContainer}>
            <Home {...remProps} />
          </Box>
          <Box className={classes.componentContainer}>
            <Status {...remProps} />
          </Box>
          <Box className={classes.componentContainer}>
            <Calls {...remProps} />
          </Box>
        </SwipeableViews>
        <Box style={{ minHeight: "60px" }} />
        <Fab
          color="secondary"
          size="medium"
          className={classes.fab}
          onClick={this.handleOpenContacts}
        >
          <ChatIcon fontSize="small" />
        </Fab>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  markMessagesSeen: (payload) => dispatch({type: "MARK_MSGS_SEEEN", ...payload}),
  addChat: (payload) => dispatch({type: 'ADD_CHAT', ...payload}),
  setUnreadMsg: (contact, count) => dispatch({type: 'SET_UNREAD_MESSAGE', contact, count})
})

export default connect(null, mapDispatchToProps)(withStyles(styles)(LandingPage));
