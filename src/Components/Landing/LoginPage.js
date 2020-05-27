import React, {Component} from 'react';
import {Paper, Card, Button, Input} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

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
    this.props.history.push('/', {
      name: this.state.name,
      email: this.state.email
    })
  }
  render(){
    const {classes} = this.props;
    return (
      <Paper>
        <Card className={classes.inputCard}>
          <Input type="text" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'name')} value={this.state.name} />
          <Input type="email" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'email')} value={this.state.email} />
          <Input type="password" classes={{root: classes.input}} onChange={(e)=>this.handleInputChange(e,'password')} value={this.state.password} />
          <Button onClick={this.handleSubmit} color="secondary" variant="contained">
            Log In
          </Button>
        </Card>
      </Paper>
    )
  }
}

export default withStyles(styles)(LoginPage);