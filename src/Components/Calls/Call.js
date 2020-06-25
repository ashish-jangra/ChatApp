import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dialog, Fab } from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { Close, CallEnd } from '@material-ui/icons';
import Peer from 'simple-peer';

const styles = theme => ({
  root: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'lightgray'
  },
  videoPreview: {
    zIndex: 5000,
    transform: 'rotateY(180deg)',
    maxHeight: '128px',
    maxWidth: '128px',
    border: '1px solid white',
    position: 'absolute',
    top: '8px',
    left: '8px'
  },
  mainVideo: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  closeButton: {
    position: 'fixed',
    boxShadow: 'none',
    top: '8px',
    right: '8px'
  },
  callEndButton: {
    background: "#f00",
    color: "#fff",
    "&:hover": {
      background: "#f00",
      color: "#fff",
    },
    position: "fixed",
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)"
  },
})

class Calls extends Component{
  constructor(props){
    super(props);
    this.state = {
      openDialog: true
    }
    this.previewRef = React.createRef();
    this.mainVideoRef = React.createRef();
  }
  setOtherUserVideoStream = otherVideoStream => {
    console.log("received other user's stream", otherVideoStream);
    if(this.mainVideoRef.current){
      this.mainVideoRef.current.srcObject = otherVideoStream;
      this.mainVideoRef.current.play();
    }
  }
  requestCall = (myVideoStream) => {
    let peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myVideoStream
    })
    peer.on('signal', signalData => {
      this.props.socket.emit('requestCall', {
        userId: this.props.callData.userId,
        signalData
      }, ackData => {
        console.log("received ack for call request")
        if(ackData)
          peer.signal(ackData);
        else
          console.log("user not online")
      })
    })
    peer.on('stream', this.setOtherUserVideoStream)
    peer.on('connect', () => {
      console.log("connection established")
      peer.send('thanks for accepting invitation')
      // this.getMyVideoStream()
      // .then(myVideoStream => peer.addStream(myVideoStream))
      // .catch(err => console.log("get stream err", err))
    })
    peer.on('data', data => {
      console.log("received data", typeof data === 'string' ? data : data.toString());
    })
  }
  acceptCall = (myVideoStream) => {
    console.log("[call] acceptcall")
    let peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myVideoStream
    });
    peer.on('signal', signalData => {
      try{
        if(signalData.type === "answer"){
          console.log("send acceptance ackdata", signalData);
          this.props.sendAck(signalData);
        }
      }
      catch(err){
        console.log("could not send back ack")
      }
    })
    peer.on('stream', this.setOtherUserVideoStream)
    peer.on('connect', () => {
      console.log("connection established")
      peer.send('thanks for reaching out to me')
      // this.getMyVideoStream()
      // .then(myVideoStream => peer.addStream(myVideoStream))
      // .catch(err => console.log("get stream err", err))
    })
    peer.on('data', data => {
      console.log("received data", typeof data === 'string' ? data : data.toString());
    })
    if(this.props.callData.signalData){
      console.log("found signal data")
      peer.signal(this.props.callData.signalData);
    }
    else{
      console.log("signal data not found")
    }
  }
  getMyVideoStream = () => {
    return navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(myVideoStream => {
      this.previewRef.current.srcObject = myVideoStream;
      return myVideoStream;
    })
    .catch(err => {throw err;})
  }
  componentDidMount(){
    if(this.props.callData.initiator){
      console.log("request initiate call")
      this.getMyVideoStream()
      .then(myVideoStream => this.requestCall(myVideoStream))
      .catch(err => console.log(err))
    }
    else{
      // acceptcall
      this.getMyVideoStream()
      .then(myVideoStream => this.acceptCall(myVideoStream))
      .catch(err => console.log(err))
    }
  }
  closeDialog = () => {
    this.setState({
      openDialog: false
    })
  }
  handlePreviewClick = () => {
    if(!this.state.openDialog){
      this.setState({
        openDialog: true
      })
    }
    else{
      // swap video preview stream with main video stream
    }
  }
  stopTracks = stream => {
    try{
      if(stream)
        stream.getTracks().forEach(track => track.stop());
    }
    catch(err){
      console.log("[Call] err, could not stop stream tracks", err);
    }
  }
  handleCallEnd = () => {
    this.props.clearCallData()
    if(this.mainVideoRef.current){
      this.stopTracks(this.mainVideoRef.current.srcObject)
    }
    if(this.previewRef.current){
      this.stopTracks(this.previewRef.current.srcObject)
    }
  }
  render(){
    const {classes} = this.props;
    return (
      <Fragment>
      <video onClick={this.handlePreviewClick} autoPlay ref={this.previewRef} className={classes.videoPreview} />
      <Dialog classes={{paper: classes.root}} fullScreen={true} open={this.state.openDialog}>
        {/* <Box className={classes.videoPreviewContainer} > */}
          <video ref={this.mainVideoRef} className={classes.mainVideo} />
          <Fab size="small" className={classes.closeButton} onClick={this.closeDialog}>
            <Close fontSize="small" />
          </Fab>
          <Fab onClick={this.handleCallEnd} size="medium" className={classes.callEndButton}>
            <CallEnd />
          </Fab>
        {/* </Box> */}
      </Dialog>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  callData: {
    userId: state.callData.userId,
    initiator: Boolean(state.callData.initiator),
    signalData: state.callData.signalData
  }
})

const mapDispatchToProps = dispatch => ({
  clearCallData: () => dispatch({type: 'CLEAR_CALL_DATA'})
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Calls));