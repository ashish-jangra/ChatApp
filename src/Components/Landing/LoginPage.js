import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Paper, Button, Input, Snackbar} from '@material-ui/core';
import {Alert} from '@material-ui/lab'
import {withStyles} from '@material-ui/core/styles';
import { getAuth } from '../serviceClass';
import LoadingDialog from '../Utility/LoadingDialog';

const styles = theme=> ({
  root: {
    height: '100%',
    padding: '16px'
  },
  loginButton: {
    marginTop: '8px'
  },
  input: {
    margin: '4px 0px',
    width: '100%'
  },
})

class LoginPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  }
  handleInputChange = (e, type) => {
    if(type === 'name'){
      this.setState({
        name: e.target.value
      })
    }
    else if(type === 'email'){
      this.setState({
        email: e.target.value
      })
    }
    else if(type === 'password'){
      this.setState({
        password: e.target.value
      })
    }
  }
  handleSubmit = () => {
    let {email, password, name} = this.state;
    email = email.trim(); password = password.trim(); name = name.trim();
    if(!email || !password || !name)
      return;
    this.loadingTimeout = setTimeout(()=> this.setState({
      loading: true
    }), 300);
    getAuth({
      name,
      email,
      password
    })
    .then(response => {
      if(response.error)
        throw new Error(response.error);
      this.props.setAuthData({
        username: response.authData.name,
        userId: response.authData.userId,
        email: response.authData.email,
        authToken: response.authData.authToken
      });
      this.props.history.replace('/');
    })
    .catch(err=> {
      clearTimeout(this.loadingTimeout);
      clearTimeout(this.errorTimeout);
      this.setState({
        loading: false,
        error: err.message
      })
      this.errorTimeout = setTimeout(()=> this.setState({error: ''}), 3000);
      console.log("error occured", err);
    })
  }
  handleKeyPress = e => {
    if(e.keyCode === 13 || e.which === 13){
      this.handleSubmit();
    }
  }
  render(){
    const {classes} = this.props;
    return (
      <Fragment>
      <Paper square className={classes.root}>
        <Input onKeyPress={this.handleKeyPress} autoFocus={true} placeholder="Name..." type="text" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'name')} value={this.state.name} />
        <Input placeholder="Email..." type="email" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'email')} value={this.state.email} />
        <Input onKeyPress={this.handleKeyPress} placeholder="Password..." type="password" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'password')} value={this.state.password} />
        <Button disabled={this.state.loading} className={classes.loginButton} onClick={this.handleSubmit} color="secondary" variant="contained">
          Log In
        </Button>
        <Snackbar open={Boolean(this.state.error)} autoHideDuration={3000}>
          <Alert severity="error">
            {this.state.error}
          </Alert>
        </Snackbar>
      </Paper>
      <LoadingDialog open={this.state.loading} content="Please wait while we are logging you in..." />
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setAuthData: (authData) => dispatch({type: 'SET_AUTH_DATA', authData})
})

export default connect(null, mapDispatchToProps)(withStyles(styles)(LoginPage));