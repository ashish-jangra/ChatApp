import React from 'react';
import { withStyles, Dialog, Box, Typography, CircularProgress } from '@material-ui/core';

const styles = theme => ({
  dialog: {
    background: 'transparent'
  },
  dialogContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '16px',
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})
const LoadingDialog = (props) => {
  const { classes } = props;
  return (
    <Dialog classes={{ paperFullScreen: classes.dialog }} fullScreen={true} open={props.open}>
      <Box className={classes.dialogContent}>
        <Typography variant="h6">
          {props.content}
        </Typography>
        <CircularProgress className={classes.loader} />
      </Box>
    </Dialog>
  )
}

export default withStyles(styles)(LoadingDialog);