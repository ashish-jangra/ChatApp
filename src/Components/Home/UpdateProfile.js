import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import SimpleHeader from "../Header/SimpleHeader";
import { Paper, Box, Button, Fab, List, ListItem, ListItemIcon, ListItemText, Dialog } from "@material-ui/core";
import { CameraAlt, Person, Info, Email, AccountCircle } from "@material-ui/icons";
import { updateProfilePic } from "../serviceClass";
import config from "../config";
import ImgThumbnail from '../Utility/imgThumbnail';

const styles = (theme) => ({
  root: {
    height: '100%'
  },
  imageContainer: {
    padding: '16px 0',
    display: 'flex',
    justifyContent: 'center'
  },
  image: {
    position: 'relative',
    height: '200px',
    width: '200px',
  },
  profileImage: {
    height: '100%',
    width: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    boxShadow: 'none'
  },
  imageInputLabel: {
    display: 'flex'
  },
  primaryText: {
    textTransform: 'capitalize'
  },
  imagePreviewContainer: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignitems: 'center',
    background: '#000',
    padding: '0 8px'
  },
  imagePreview: {
    width: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  footer: {
    minHeight: '48px'
  },
  button: {
    borderRadius: 0,
    background: '#000',
    color: '#fff',
    "&:hover": {
      background: '#000',
      color: '#fff',
    },
    width: '50%',
    height: '100%'
  }
});

class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreview: false,
      username: this.props.username,
      email: this.props.email,
      profileSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQH4oKJ7RPXSvtqmAJq6D9VNQyf47ZbACYDHg&usqp=CAU'
    };
    this.imagePreviewRef = React.createRef()
    this.imageInputRef = React.createRef()
    this.imagePreviewSrc = ''
  }
  handleImageInputChange = e => {
    if(e.target.files.length > 0){
      let imageFile = e.target.files[0];
      console.log("image inpuct chnages")
      this.setState({
        imagePreview: true
      })
      this.imagePreviewSrc = URL.createObjectURL(imageFile)
    }
  }
  componentDidUpdate(prevProps, prevState){
    if(!prevState.imagePreview && this.state.imagePreview){
      if(this.imagePreviewRef.current){
        this.imagePreviewRef.current.src = this.imagePreviewSrc
      }
    }
  }
  updateProfilePic = () => {
    if(this.imageInputRef.current && this.imageInputRef.current.files.length > 0){
      let formData = new FormData();
      formData.append('profilePic', this.imageInputRef.current.files[0]);
      updateProfilePic(formData)
      .then(res => {
        this.setState({
          profileSrc: config.getImage(res.filename)
        })
      })
      .catch(err=>{
        console.log("updateProfilePic err", err);
      })
    }
  }
  handlePreviewClose = applyChanges => {
    if(applyChanges){
      this.updateProfilePic()
      this.setState({
        imagePreview: false,
      })
    }
    else{
      this.setState({
        imagePreview: false
      })
    }
    if(this.imageInputRef.current){
      this.imageInputRef.current.value = ''
    }
  }
  handleImageError = e => e.target.src = 'https://www.blogsaays.com/wp-content/uploads/2014/02/no-user-profile-picture-whatsapp.jpg'
  render() {
    const {classes} = this.props;
    return (
      <Fragment>
        <SimpleHeader headerText={{ primary: "Profile" }} />
        <Paper square className={classes.root}>
          <Box className={classes.imageContainer}>
            <Box className={classes.image}>
              <ImgThumbnail background="lightgray" height="100%" fontSize="3.5rem" src={config.getProfilePic(this.props.userId)} className={classes.profileImage} />
                <Fab color='primary' size='large' className={classes.cameraButton}>
                  <label className={classes.imageInputLabel} htmlFor="imageInput">
                    <CameraAlt />
                  </label>
                </Fab>
              <input ref={this.imageInputRef} onChange={this.handleImageInputChange} id="imageInput" type="file" accept="image/*" style={{display: 'none'}} />
            </Box>
          </Box>
          <List>
            <ListItem button>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText classes={{primary: classes.primaryText}} primary={this.props.username} secondary="This is ur editable username, public to your contacts" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText classes={{primary: classes.primaryText}} primary="About" secondary="Your about line appears here" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText primary={this.props.email} secondary="Your registered email on chatapp" />
            </ListItem>
          </List>
        </Paper>
        <Dialog onClose={()=> this.setState({imagePreview: false})} open={this.state.imagePreview} fullScreen={true}>
          <Box className={classes.imagePreviewContainer} >
            <img src={this.imagePreviewSrc} className={classes.imagePreview} ref={this.imagePreviewRef} />
          </Box>
          <Box className={classes.footer}>
            <Button onClick={()=>this.handlePreviewClose()} className={classes.button}>
              Cancel
            </Button>
            <Button onClick={()=>this.handlePreviewClose(true)} className={classes.button}>
              Done
            </Button>
          </Box>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.username,
  userId: state.userId,
  email: state.email,
});

export default connect(mapStateToProps)(withStyles(styles)(UpdateProfile));
