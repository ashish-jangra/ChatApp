import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class Status extends Component{
  render(){
    return (
      <Typography style={{padding: "50px"}} variant="body2">
        <b>Status: </b> This feature is under progress, it will be realeased soon. It would have status updates posted by the contacts of the user and also let the user post a status update
      </Typography>
    )
  }
}

export default Status;