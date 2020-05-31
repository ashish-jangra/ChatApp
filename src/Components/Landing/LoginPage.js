import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Paper, Card, Button, Input} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { getAuth } from '../serviceClass';

const styles = theme=> ({
  inputCard: {
    padding: '8px',
    margin: '8px'
  },
  input: {
    width: '100%'
  }
})

class LoginPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      name: '',
      email: '',
      password: ''
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
    getAuth({
      name,
      email,
      password
    })
    .then(response => {
      this.props.setAuthData({
        username: response.authData.name,
        userId: response.authData.userId,
        email: response.authData.email,
        authToken: response.authData.authToken
      });
      this.props.history.replace('/');
    })
    .catch(err=> {
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
      <Paper>
        <Card className={classes.inputCard}>
          <Input onKeyPress={this.handleKeyPress} autoFocus={true} placeholder="Name..." type="text" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'name')} value={this.state.name} />
          <Input placeholder="Email..." type="email" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'email')} value={this.state.email} />
          <Input onKeyPress={this.handleKeyPress} placeholder="Password..." type="password" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'password')} value={this.state.password} />
          <Button onClick={this.handleSubmit} color="secondary" variant="contained">
            Log In
          </Button>
        </Card>
      </Paper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  setAuthData: (authData) => dispatch({type: 'SET_AUTH_DATA', authData})
})

export default connect(null, mapDispatchToProps)(withStyles(styles)(LoginPage));