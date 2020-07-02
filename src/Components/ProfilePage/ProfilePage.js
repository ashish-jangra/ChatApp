import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  Card,
  List,
  ListItem,
  Divider,
  Grid,
  Box,
  IconButton,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import {
  Chat,
  Call,
  Videocam,
  Block,
  ThumbDown,
  Person,
  ArrowBack,
} from "@material-ui/icons";
import config from "../config";
import { getContactInfo } from "../serviceClass";

const styles = (theme) => ({
  rootPaper: {
    height: "100vh",
    background: "lightgray",
    paddingBottom: "24px",
  },
  appbar: {
    position: "absolute",
    top: 0,
    left: 0,
    background: "linear-gradient(rgba(0,0,0,0.3), transparent)",
    boxShadow: "none",
  },
  toolbar: {
    padding: 0,
  },
  backButton: {
    color: "#fff",
  },
  profileImage: {
    width: "100vw",
    height: "100vw",
    objectFit: "cover",
  },
  aboutCard: {
    marginTop: "8px",
  },
  aboutList: {
    padding: "8px",
  },
  userName: {
    textTransform: "capitalize",
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: "120px",
    display: "flex",
    alignItems: "flex-end",
    fontSize: "1.3rem",
    padding: "12px 16px",
    backgroundImage:
      "linear-gradient(transparent, rgba(0,0,0,0.125), rgba(0,0,0,0.25))",
    color: "white",
  },
  simpleCard: {
    color: "red",
    marginTop: "8px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
  },
  personIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    fontSize: "150px",
    color: theme.palette.text.secondary,
  },
  infoContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  email: {
    width: "100%",
    wordBreak: 'break-all'
  },
});

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.match.params.userId,
      name: "...",
      email: "...",
      about: "...",
      profilePic: config.getProfilePic(this.props.match.params.userId),
    };
  }
  handleProfilePicError = (e) => {
    this.setState({
      profilePic: "",
    });
  };
  handleGoBack = () => {
    this.props.history.goBack();
  };
  componentDidMount() {
    getContactInfo(this.state.userId)
      .then((res) => {
        this.setState({
          name: res.name,
          email: res.email,
          about: res.about,
        });
      })
      .catch((err) => console.log("[profilePage] getcontacctinfo error", err));
  }
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.rootPaper} square>
        <AppBar className={classes.appbar}>
          <Toolbar variant="dense" className={classes.toolbar}>
            <IconButton
              onClick={this.handleGoBack}
              className={classes.backButton}
            >
              <ArrowBack />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          style={{ position: "relative", height: "100vw", overflow: "hidden" }}
        >
          {this.state.profilePic ? (
            <img
              onError={this.handleProfilePicError}
              alt="profile pic"
              className={classes.profileImage}
              src={this.state.profilePic}
            />
          ) : (
            <Person className={classes.personIcon} />
          )}
          <Typography className={classes.userName} variant="h6">
            {this.state.name}
          </Typography>
        </Box>
        <Card className={classes.aboutCard} square>
          <List className={classes.aboutList}>
            <ListItem>
              <Typography color="primary" variant="body2">
                About and Phone Number
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">{this.state.about}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <Box className={classes.infoContainer}>
                <Typography variant="body1" className={classes.email}>
                  {this.state.email}
                </Typography>
                <IconButton color="primary" style={{ padding: "8px" }}>
                  <Chat />
                </IconButton>
                <IconButton color="primary" style={{ padding: "8px" }}>
                  <Call />
                </IconButton>
                <IconButton color="primary" style={{ padding: "8px" }}>
                  <Videocam />
                </IconButton>
              </Box>
            </ListItem>
          </List>
        </Card>
        <Card className={classes.simpleCard} square>
          <Block />
          <Typography style={{ marginLeft: "16px" }} variant="body1">
            Block
          </Typography>
        </Card>
        <Card className={classes.simpleCard} square>
          <ThumbDown />
          <Typography style={{ marginLeft: "16px" }} variant="body1">
            Report Contact
          </Typography>
        </Card>
      </Paper>
    );
  }
}

export default withStyles(styles)(ProfilePage);
