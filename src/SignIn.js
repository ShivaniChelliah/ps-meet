import React, { Component } from 'react';
import fire from './config/fire';
import { Redirect } from 'react-router';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { StyledLink } from 'baseui/link';
import { styled } from 'baseui';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';


const Container = styled('div', { width: '700px' });

class SignIn extends Component {

  constructor(props) {
    super();

    this.state = {
      email: '',
      password: '',
      errors: ''
    }
  }

  onFormSubmit = (user) => {
    user.preventDefault();

    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
      var errorMessage = error.message;

      var errors = '';

      errors = errorMessage;
      console.log("error", error);
      this.setState({ errors: errors });
    });
  }

  setEmail(event) {
    this.setState({
      email: event.target.value
    })
  }

  setPassword(event) {
    this.setState({
      password: event.target.value
    })
  }

  render() {
    if (this.props.authUser) {
      return (
        <Redirect to={"/"} />
      )
    }
    else {
      return (
        <Container>
          <React.Fragment>
            <h1>Sign In</h1>
            <Block as="br" />

            <FormControl label="Email" >
              <Input onChange={(event) => { this.setEmail(event) }} />
            </FormControl>
            <Block as="br" />

            <FormControl label="Password">
              <Input type="password" onChange={(event) => { this.setPassword(event) }} />
            </FormControl>
            <Block as="br" />
            <Button onClick={(event) => { this.onFormSubmit(event) }}>Sign In</Button>

            <Block font="font450">
              <Block as="br" />
              <StyledLink href="/sign-up">New to ps-meet. Sign up to create account</StyledLink>
            </Block>
          </React.Fragment>
        </Container>

      );
    }
  }
}

export default SignIn
