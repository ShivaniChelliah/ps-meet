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

            this.setState({ errors: errors });
        });
    }

    setEmail(email) {
        this.setState({
            email: email
        })
    }

    setPassword(password) {
        this.setState({
            password: password
        })
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
                        <h1>Sign In</h1>
                        <Block as="br" />

                        <FormControl label="Email" >
                            <Input onChange={(email) => { this.setEmail(email) }} />
                        </FormControl>
                        <Block as="br" />

                        <FormControl label="Password">
                            <Input type="password" onChange={(password) => { this.setPassword(password) }} />
                        </FormControl>
                        <Block as="br" />
                        <Button >Sign In</Button>

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
