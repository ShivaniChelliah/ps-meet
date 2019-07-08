import React, { Component } from 'react';
import fire from './config/fire';
import { Redirect } from 'react-router';
import { FormControl } from 'baseui/form-control';
import { StatefulInput, SIZE } from 'baseui/input';
import { StatefulButton } from 'baseui/button';
import { styled } from 'baseui';
import { Button, KIND } from 'baseui/button';
import { Block } from 'baseui/block';


const Container = styled('div', { width: '300px' });


class SignIn extends Component {


  constructor(props) {
    console.log(0);

    super();

    this.state = {
      user: {
        email: '',
        password: '',
      }, errors: ''
    }
  }

  onFormSubmit = (user) => {
    user.preventDefault();

    fire.auth().signInWithEmailAndPassword(this.state.user.email, this.state.user.password).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      var errors = '';

      errors = errorMessage;

      this.setState({ errors: errors });
    });
  }

  handleChange = (user) => {

    const newUser = this.state.user;
    newUser[user.target.name] = user.target.value;

    this.setState({
      newUser: user
    })

    console.log(this.state.user);
  }

  render() {


    const { user } = this.state;
    if (this.props.log) {
      return (
        <Redirect to={"/users"} />
      )
    }
    else {
      return (
      
          <StatefulButton>

            overrides={{
              Label: {
                style: {
                  background: '#892C21',
                },

              },

            }
            }
            />
      
        </StatefulButton>
        <Container>
          <React.Fragment>
            <FormControl label="Username" >
              <StatefulInput />
            </FormControl>

            <FormControl label="Password" >
              <StatefulInput />
            </FormControl>
            <StatefulButton />
            <Button >Sign In</Button>
            <Block as="span" marginLeft="scale500" />
          </React.Fragment>
        </Container >
      );
    }
  }
}

export default SignIn;