import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Box,
  Container,
  Typography,
  InputBase,
  IconButton,
  Zoom,
} from "@material-ui/core";
import {
  Send as SendIcon,
  GetApp as DownloadIcon,
  AttachFile,
  InsertDriveFile,
  InsertPhoto,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import ChatHeader from "../Header/ChatHeader";
import { getChatTimeString } from "../Utility/CommonFunctions";
import { sendImage } from "../serviceClass";
import CONFIG from "../config";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden auto",
    height: "100%",
    paddingTop: "16px",
    paddingBottom: "8px",
    background: "lightgray",
    backgroundSize: "contain",
  },
  messageContainer: {
    marginBottom: "8px",
  },
  myMessageBox: {
    position: "relative",
    wordBreak: "break-word",
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: "8px 0 8px 8px",
    backgroundColor: "#cfe9ba",
  },
  otherMessageBox: {
    position: "relative",
    wordBreak: "break-word",
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: "0px 8px 8px 8px",
    backgroundColor: "white",
  },
  chatFeedback: {
    position: "absolute",
    fontSize: "0.7rem",
    bottom: "2px",
    right: "12px",
    color: "gray",
  },
  multimediaFeedback: {
    position: "absolute",
    bottom: "4px",
    right: "4px",
    height: "5em",
    width: "50%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingRight: "6px",
    color: "white",
    background:
      "radial-gradient(at bottom right, rgba(0,0,0,0.5), transparent,transparent)",
  },
  inputContainer: {
    position: "sticky",
    padding: "6px 0",
    alignItems: "flex-end",
    bottom: 0,
    left: 0,
    width: "100%",
    // border: '1px solid red',
    // boxSizing: 'border-box',
    display: "flex",
    background: "lightgray",
    // backgroundSize: 'contain',
  },
  textFieldContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "24px",
    paddingLeft: "20px",
    paddingRight: "2px",
    display: "flex",
    alignItems: "center",
    margin: "0 6px",
    minHeight: "48px",
  },
  textFieldRoot: {
    width: "100%",
    fontSize: "0.875rem",
  },
  fab: {
    padding: "12px",
    marginRight: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "200px",
    color: "white",
  },
  noUnderLine: {
    borderBottom: "none !important",
    "&:before": {
      borderBottom: "none",
    },
    "&:after": {
      borderBottom: "none",
    },
    "&:hover": {
      borderBottom: "none",
    },
  },
  imageContainer: {
    padding: "4px",
    paddingBottom: "0px",
    borderRadius: "8px",
    overflow: "hidden",
  },
  chatImage: {
    height: "250px",
    width: "250px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  attachFileButton: {
    maxHeight: "48px",
  },
  attachFileLabel: {
    display: "flex",
    transform: "rotate(-45deg)",
  },
  imageInputButton: {
    background: `linear-gradient(-180deg, #042573 50%, #6433ff 50%)`,
    color: theme.palette.primary.contrastText,
    maxHeight: "48px",
    marginRight: "8px",
  },
  fileInputButton: {
    background: `linear-gradient(-180deg, red 50%, #ff5c33 50%)`,
    color: theme.palette.primary.contrastText,
    maxHeight: "48px",
    marginRight: "8px",
  },
  fileInputLabel: {
    display: "flex",
  },
  fileInputMenu: {
    position: "fixed",
    bottom: "60px",
    right: "0px",
    display: "flex",
    padding: "0 8px",
    marginTop: "8px",
    minHeight: "54px",
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);
    let contact,
      dummyContact = {
        name: "Loading...",
        email: "anonymous@chatapp.com",
        chats: [],
      };
    if (this.props.location.state && this.props.location.state.contact) {
      contact = this.props.contacts.find(
        (ct) => ct.email === this.props.location.state.contact.email
      ) || dummyContact;
    } else {
      contact = dummyContact;
    }
    this.state = {
      contact,
      activateFileInput: false,
    };
    window.scrollTo(0, document.body.scrollHeight);
    this.inputRef = React.createRef();
    this.lastMsgRef = React.createRef();
  }
  handleMessageTextChange = (e) => {
    if (e.target.value.endsWith("\n")) return;
    this.setState({
      messageText: e.target.value,
    });
  };
  handleMessageSend = () => {
    let message = this.state.messageText.trim();
    let contact = JSON.parse(JSON.stringify(this.state.contact));
    let newMsg = {
      from: this.props.authData.email,
      msg: message,
      sent: new Date()
    }
    if (contact.type === "group") {
      this.props.socket.emit("sendMessageInGroup", {
        groupName: this.props.match.params.contact,
        msg: message,
      });
    } else {
      this.props.socket.emit("sendPersonalMessage", {
        to: this.state.contact.userId,
        msg: message,
      }, ack => {
        console.log("received ack", ack)
        newMsg._id = ack._id
      });
    }
    this.props.addChat({
      contact: this.state.contact.email,
      msg: newMsg
    })
    // if (contact.chats && Number.isInteger(contact.chats.length))
    //   contact.chats.push(newMsg);
    // else
    //   contact.chats = [ newMsg ];
    // focus again on msg input
    this.inputRef.current && this.inputRef.current.focus();
    this.setState({ messageText: "" });
  };
  scrollToBottom = () => {
    this.lastMsgRef.current &&
      this.lastMsgRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };
  componentDidUpdate(prevProps, prevState) {
    // auto scroll to bottom on receiving new msg
    this.scrollToBottom();
    if (prevState.contact.chats.length < this.state.contact.chats.length) {
    }
  }
  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      if (this.state.messageText && this.state.messageText.trim()) {
        this.handleMessageSend();
      }
    }
  };
  handleReceiveMessage = (data) => {
    console.log("[Chat] handlereceivemsg", data);
    let contact = this.state.contact;
    let { from } = data;
    this.props.addChat({
      contact: from,
      msg: data,
      incUnread: from !== this.state.contact.email
    });
    if (from === contact.email) {
      this.props.socket.emit("clearUnreadMessages", {
        userId: this.state.contact.userId,
      }, ack => {
        console.log(ack)
      });
      // contact.chats.push({
      //   from: data.from,
      //   msg: data.msg,
      // });
      this.setState({
        update: true,
      });
    }
  };
  componentDidMount() {
    setTimeout(this.scrollToBottom, 500);
    const { socket } = this.props;
    this.props.clearUnreadMsg(this.state.contact.email);
    socket.emit("clearUnreadMessages", { userId: this.state.contact.userId }, ack => console.log(ack));
    // socket.emit('joinRoom', {
    // 	groupName: this.props.match.params.contact
    // })
    socket.on("receiveMessage", this.handleReceiveMessage);
  }
  componentWillUnmount() {
    this.props.socket.off("test");
    this.props.socket.removeEventListener(
      "receiveMessage",
      this.handleReceiveMessage
    );
  }
  fastRandId = () => new Date().getTime().toString(36) + Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)
  sendImage = async (imageFile) => {
    let localURL = URL.createObjectURL(imageFile);
    let newMsg = {
      type: "img",
      from: this.props.authData.email,
      msg: localURL,
      _id: this.fastRandId(),
      uploaded: false
    };
    this.props.addChat({
      contact: this.state.contact.email,
      msg: newMsg
    })
    this.setState({
      activateFileInput: false
    })
    let imageData = new FormData();
    imageData.append("imageData", imageFile, imageFile.name);
    try {
      let res = await sendImage(imageData);
      if (!res.filename) throw new Error("no filename returned");
      this.props.socket.emit("sendPersonalMessage", {
        to: this.state.contact.userId,
        msg: CONFIG.getImage(res.filename),
        type: "img",
      }, ack => {
        console.log("received ack", ack)
      });
    } catch (err) {
      console.log("[Chat] sendIMage err", err.message);
    }
  };
  handleImageInputChange = async (e) => {
    let imageInput = e.target;
    if (imageInput.files.length > 0) {
      for (let i = 0; i < imageInput.files.length; i++) {
        this.sendImage(imageInput.files[i])
      }
    }
  };
  sendFile = file => {
    let fileType = file.type.slice(0, file.type.indexOf("/"));
    let fileExtension = file.name.slice(file.name.lastIndexOf(".")+1);
    console.log("file", file, "fileType", {fileType, fileExtension});
    if(fileType === "application" && fileExtension === "pdf"){
      console.log("display pdf");
      let newMsg = {
        type: "pdf",
        from: this.props.authData.email,
        msg: file.name,
        _id: this.fastRandId(),
        uploaded: false
      }
      this.props.addChat({
        contact: this.state.contact.email,
        msg: newMsg
      })
      this.setState({
        activateFileInput: false
      })
    }
  }
  handleFileInputChange = e => {
    let fileInput = e.target;
    if(fileInput.files.length > 0){
      for (let i = 0; i < fileInput.files.length; i++) {
        this.sendFile(fileInput.files[i])
      }
    }
  }
  toggleFileInput = () =>
    this.setState((prevState) => ({
      activateFileInput: !Boolean(prevState.activateFileInput),
    }));
  closeFileInput = () => this.setState({ activateFileInput: false });
  openFileInput = () => this.setState({ activateFileInput: true });
  getMessage = (chat, classes) => {
    let spaces = <span style={{ marginLeft: "4em" }} />;
    if(chat.type === "img")
      return <img className={classes.chatImage} src={chat.msg} />
    if(chat.type === "pdf")
      return (
        <Fragment>
          <InsertDriveFile fontSize="small" />
          <Typography variant="body2">
            {chat.msg} {spaces}
          </Typography>
        </Fragment>
      )
    return (
      <Typography variant="body2">
        {chat.msg} {spaces}
      </Typography>
    )
  }
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <ChatHeader
          headerText={this.state.contact.name}
          isGroup={this.state.contact.type === "group"}
          userId={this.state.contact.userId}
        />
        <Container
          className={classes.root}
          // style={{ minHeight: `${window.innerHeight - (52 + 90)}px` }}
        >
          {this.state.contact &&
            this.state.contact.chats &&
            this.state.contact.chats[0] &&
            this.state.contact.chats.map((chat, index) => (
              <Box
                ref={
                  index === this.state.contact.chats.length - 1
                    ? this.lastMsgRef
                    : null
                }
                key={index}
                className={classes.messageContainer}
                display="flex"
                style={{
                  marginBottom:
                    index === this.state.contact.chats.length - 1
                      ? "0px"
                      : "8px",
                }}
                justifyContent={
                  chat.from === this.props.authData.email
                    ? "flex-end"
                    : "flex-start"
                }
              >
                <Box
                  className={
                    (chat.from === this.props.authData.email
                      ? classes.myMessageBox
                      : classes.otherMessageBox) +
                    " " +
                    (chat.type === "img" && classes.imageContainer)
                  }
                >
                  {this.getMessage(chat, classes)}
                  <Typography
                    variant="caption"
                    className={
                      chat.type === "img"
                        ? classes.multimediaFeedback
                        : classes.chatFeedback
                    }
                  >
                    {getChatTimeString(chat.sent)}
                  </Typography>
                </Box>
              </Box>
            ))}
          {this.state.activateFileInput && (
            <Zoom in={this.state.activateFileInput}>
              <Box className={classes.fileInputMenu}>
                <IconButton disabled={true} className={classes.imageInputButton}>
                  <label className={classes.fileInputLabel} htmlFor="fileInput">
                    <InsertDriveFile />
                  </label>
                </IconButton>
                <IconButton className={classes.fileInputButton}>
                  <label
                    className={classes.fileInputLabel}
                    htmlFor="imageInput"
                  >
                    <InsertPhoto />
                  </label>
                </IconButton>
              </Box>
            </Zoom>
          )}
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
              placeholder="Type message..."
              classes={{ root: classes.textFieldRoot }}
              type="text"
            />
            <IconButton
              className={classes.attachFileButton}
              size="medium"
              onClick={this.toggleFileInput}
            >
              <AttachFile
                className={classes.attachFileLabel}
                fontSize="small"
              />
            </IconButton>
            <input
              onChange={this.handleImageInputChange}
              type="file"
              multiple
              accept="image/*"
              id="imageInput"
              style={{ display: "none" }}
            />
            <input
              onChange={this.handleFileInputChange}
              type="file"
              multiple
              accept="*"
              id="fileInput"
              style={{ display: "none" }}
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

const mapStateToProps = (state) => ({
  authData: {
    email: state.email,
  },
  contacts: state.contacts,
});

const mapDispatchToProps = (dispatch) => ({
  setContacts: (contacts) => dispatch({ type: "SET_CONTACTS", contacts }),
  addChat: (payload) => dispatch({ type: "ADD_CHAT", ...payload }),
  clearUnreadMsg: (contact) =>
    dispatch({ type: "SET_UNREAD_MESSAGE", contact, count: 0 }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Chat));
