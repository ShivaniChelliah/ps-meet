import React, { Component } from 'react';
import fire from './config/fire';
import { Redirect } from 'react-router';
import { FormControl } from 'baseui/form-control';
import { styled } from 'baseui';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';

const Container = styled('div', { width: '700px' });

class CreateAccount extends Component {
  constructor(props) {
    super(props);

  }

  state = {
    email: '',
    password: '',
    loggedIn: false,
    firstName: '',
    lastName: '',
    errors: ''
  }

  onFormSubmit = (event) => {
    var name = this.state.firstName;
    console.log(this.state.email);
    console.log(this.state.password);
    console.log("dad", this.state.firstName);
    event.preventDefault();
    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {


    }).then(() => {
      var user = fire.auth().currentUser;

      var displayName = this.state.firstName;
      user.updateProfile({

        displayName: name

      }).catch(function (error) {

        var errorMessage = error.message;
        var errors = '';
        errors = errorMessage;
        this.setState({ errors: errors });
      });



      // ...
    })
  }

  setEmail(event) {
    this.setState({
      email: event.target.value
    })
    // console.log(this.setState(email));
    console.log(typeof (this.state.email));
    console.log(this.state.email)
    console.log(event)
  }
  setFirstName(event) {
    this.setState({
      firstName: event.target.value
    })
    console.log("123", this.state.firstName);
  }
  setLastName(event) {
    this.setState({
      lastName: event.target.value
    })
    console.log(this.state.lastName);
  }
  setPassword(event) {
    this.setState({
      password: event.target.value
    })
    console.log(this.state.password)
    console.log(event.target)
    console.log("i am password", typeof (password))
  }

  render() {
    if (this.props.log) {
      return (
        <Redirect to={"/"} />
      )
    }
    else {
      return (
        <Container>
          <React.Fragment>
            <h1>Sign Up</h1>
            <Block as="br" />
            <FormControl label="First Name" >
              <Input type="text" onChange={(event) => { this.setFirstName(event) }} value={this.state.firstName} />
            </FormControl>
            <Block as="br" />
            <FormControl label="Last Name" >
              <Input type="text" onChange={(event) => { this.setLastName(event) }} value={this.state.lastName} />
            </FormControl>
            <Block as="br" />
            <FormControl label="Email" >
              <Input type="email" onChange={(event) => { this.setEmail(event) }} value={this.state.email} />
            </FormControl>
            <Block as="br" />

            <FormControl label="Password">
              <Input type="password" onChange={(event) => { this.setPassword(event) }} value={this.state.password} />
            </FormControl>
            <Block as="br" />

            <Button onClick={(event) => { this.onFormSubmit(event) }}>Sign Up</Button>

          </React.Fragment>
        </Container>
      );
    }
  }

}

export default CreateAccount;