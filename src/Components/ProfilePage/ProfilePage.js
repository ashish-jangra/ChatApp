import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import ProfilePic from '../../Data/john.jpg';
import {Paper, Typography, Card, List, ListItem, Divider, Grid, Box, IconButton} from '@material-ui/core';
import { Chat, Call, VideoCall, Block, ThumbDown } from '@material-ui/icons';

const styles = (theme) => ({
  rootPaper: {
    height: '100vh',
    background: 'lightgray',
    paddingBottom: '24px'
  },
  profileImage: {
    width: '100vw',
    height: '100vw',
    objectFit: 'cover'
  },
  aboutCard: {
    marginTop: '8px'
  },
  aboutList: {
    padding: '8px'
  },
  userName: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: '120px',
    display: 'flex',
    alignItems: 'flex-end',
    fontSize: '1.3rem',
    padding: '12px',
    backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.125), rgba(0,0,0,0.25))',
    color: 'white'
  },
  simpleCard: {
    color: 'red',
    marginTop: '8px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center'
  }
});

class ProfilePage extends Component{
  render(){
    const {classes} = this.props;
    return (
      <Paper className={classes.rootPaper} square>
        <Box style={{position: 'relative', height: '100vw', overflow: 'hidden'}}>
          <img alt="profile pic" className={classes.profileImage} src={ProfilePic} />
          <Typography className={classes.userName} variant="h6">
            John Wick
          </Typography>
        </Box>
        <Card className={classes.aboutCard} square>
          <List className={classes.aboutList}>
            <ListItem>
              <Typography color="primary" variant="caption">
                About and Phone Number
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body2">
                I'm a strong boy!
              </Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <Grid container>
                <Grid item xs={7} style={{display: 'flex', alignItems: 'center'}}>
                  <Typography variant="body2">
                    +91 9896856237
                  </Typography>
                </Grid>
                <Grid style={{justifyContent: 'flex-end'}} container item xs={5}>
                  <IconButton color="primary" style={{padding: '8px'}}>
                    <Chat />
                  </IconButton>
                  <IconButton color="primary" style={{padding: '8px'}}>
                    <Call />
                  </IconButton>
                  <IconButton color="primary" style={{padding: '8px'}}>
                    <VideoCall />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </Card>
        <Card className={classes.simpleCard} square>
          <Block />
          <Typography style={{marginLeft: '16px'}} variant="body2">
            Block
          </Typography>
        </Card>
        <Card className={classes.simpleCard} square>
          <ThumbDown />
          <Typography style={{marginLeft: '16px'}} variant="body2">
            Report Contact
          </Typography>
        </Card>
      </Paper>
    )
  }
}

export default withStyles(styles)(ProfilePage);