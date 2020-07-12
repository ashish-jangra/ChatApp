import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux';
import { Paper, TextField, Container, Grid, Button, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle as AccountCircleIcon, Email as EmailIcon, Call as ContactIcon } from '@material-ui/icons';
import SimpleHeader from '../Header/SimpleHeader';
import {addContact} from '../serviceClass';

const styles = (theme) => ({
  root: {
    height: '100%'
  },
	rootContainer: {
		padding: '16px',
  },
  contactInputCard: {
    padding: '18px 12px 8px'
  },
  inputContainer: {
    paddingLeft: '12px'
  },
	input: {
		width: '100%',
  },
  row: {
    paddingBottom: '16px'
  },
  cancelButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 18px'
  },
  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '12px 18px'
  }
});

class AddContact extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      invalidName: false,
      email: '',
      invalidEmail: false
    }
  }
  isValidInput = () => {
    if(!this.state.name.trim()){
      this.setState({
        invalidName : true
      });
      return false;
    }
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let isValidEmail = reg.test(this.state.email.trim());
    if(!isValidEmail){
      this.setState({
        invalidEmail : true
      });
      return false;
    }
    return true;
  }
  handleAddContact = () => {
    if(!this.isValidInput()){
      return;
    }
    let {name, email} = this.state;
    name = name.trim();
    email = email.trim();
    addContact({
      name, email
    })
    .then(data=>{
      if(!data.contact || !data.saved)
        throw new Error("no contact returned")
      console.log("[AddContact] handleAddContact received saved contact data", data);
      this.props.addContact(data.contact);
      this.props.history.replace(`/chat/${data.contact.email}`, {
        contact: data.contact
      });
    })
    .catch(err=>{
      console.log("[AddContact] handleAddContact error adding contact", err)
    })
  }
  handleCancel = () => {
    this.props.history.goBack();
  }
  handleInputChange = (key, e) => {
    if(key === "name"){
      this.setState({
        invalidName: false,
        name: e.target.value
      })
    }
    else if(key === "email"){
      this.setState({
        invalidEmail: false,
        email: e.target.value
      })
    }
  }
	render() {
		const { classes } = this.props;
		return (
			<Fragment>
        <SimpleHeader headerText={{primary: 'Add Contact'}} />
				<Paper className={classes.root} square>
					<Container className={classes.rootContainer}>
            {/* <Card className={classes.contactInputCard}> */}
						<Grid className={classes.row} container>
							<Grid item xs={1}>
                <AccountCircleIcon />
              </Grid>
							<Grid item xs={11} className={classes.inputContainer}>
								<TextField color="secondary" error={this.state.invalidName} autoFocus={true} onChange={(e)=> this.handleInputChange("name",e)} className={classes.input} placeholder="Name" />
							</Grid>
						</Grid>
            <Grid className={classes.row} container>
							<Grid item xs={1}>
                <EmailIcon />
              </Grid>
							<Grid item xs={11} className={classes.inputContainer}>
								<TextField color="secondary" error={this.state.invalidEmail} onChange={(e)=> this.handleInputChange("email",e)} className={classes.input} placeholder="Email" />
							</Grid>
						</Grid>
            <Grid container>
              <Grid className={classes.cancelButtonContainer} item xs={6}>
                <Button onClick={this.handleCancel} color="secondary" variant="outlined">
                  Cancel
                </Button>
              </Grid>
              <Grid className={classes.saveButtonContainer} item xs={6}>
                <Button onClick={this.handleAddContact} color="secondary" variant="contained">
                  Save
                </Button>
              </Grid>
            </Grid>
            {/* </Card> */}
					</Container>
				</Paper>
			</Fragment>
		);
	}
}

const mapDispatchToProps = dispatch => ({
  addContact: (contact) => dispatch({type: 'ADD_CONTACT', contact})
})

export default connect(null, mapDispatchToProps)(withStyles(styles)(AddContact));
