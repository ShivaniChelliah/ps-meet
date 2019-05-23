import React, {Component} from 'react';
import fire from './config/fire'; 
import {Redirect} from 'react-router';
import {Container, Form, Header} from 'semantic-ui-react';

class SignIn extends Component{

  constructor(props){
    console.log(0);

    super();

    this.state = {
      user:{
        email:'',
        password:'',
      }, errors: ''
  }
  }

   onFormSubmit = (user) => {
    user.preventDefault();

    fire.auth().signInWithEmailAndPassword(this.state.user.email, this.state.user.password).catch((error)=> {     
            var errorCode = error.code;
            var errorMessage = error.message;

            var errors = '';
           
            errors = errorMessage;
            
            this.setState({errors: errors});
         });
      }
      
    handleChange=(user)=>{
      
        const newUser=this.state.user;
        newUser[user.target.name] =  user.target.value;

        this.setState({
            newUser: user
         })
         
        console.log(this.state.user);
    }

    render(){
      const {user} = this.state;
      if (this.props.log) {   
        return(
           <Redirect to={"/users"}  /> 
        )
      }
         else {   
          return (
            <Container>
           
            <Form>
            <Header as='h2'>Sign In</Header>

            {this.state.errors!== ''?<p id='error'>Error: {this.state.errors}</p>:''}
            
            <Form.Field>
            <label htmlFor="email">email</label>
            <input type="email" name='email' id="email" value={user.email} onChange={this.handleChange}/>
            </Form.Field>
            
            <Form.Field>
            <label htmlFor="password">password</label>
            <input type="password" name='password' id="password" value={user.password} onChange={this.handleChange}/>
            </Form.Field>
           
            <button className="ui button" onClick={this.onFormSubmit}>Login</button>    
           
            </Form>
              
            </Container>
    );
  }
}
}

export default SignIn;