import React, { Component} from 'react'
import "./index.css"
import fire from './config/fire'
import {Redirect} from 'react-router';
import {Container, Form, Header} from 'semantic-ui-react';


class CreateAccount extends Component {
    state = {
        user:{          
          email:'',
          password:'',
          loggedIn:false
        }, 
        errors: ''
    }
    
   onFormSubmit = (user) => {

    user.preventDefault(); 
    fire.auth().createUserWithEmailAndPassword(this.state.user.email, this.state.user.password).catch((error)=> {
        // Handle Errors here.
        //var errorCode = error.code;
        var errorMessage = error.message;
        var errors = '';
        errors = errorMessage;
       
        this.setState({errors: errors});
        // ...
      });
   
          console.log(this.state.loggedIn);
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
            <React.Fragment>
           
            <Form>
            <Header as='h2'>Sign Up</Header>

            {this.state.errors!== ''?<p id='error'>Error: {this.state.errors}</p>:''}
            
            <Form.Field>
            <label htmlFor="email">email</label>
            <input type="email" name='email' id="email" value={user.email} onChange={this.handleChange}/>
            </Form.Field>
            
            <Form.Field>
            <label htmlFor="password">password</label>
            <input type="password" name='password' id="password" value={user.password} onChange={this.handleChange}/>
            </Form.Field>
           
            <button className="ui primary button" onClick={this.onFormSubmit}>Create Account</button>    
           
            </Form>
              
            </React.Fragment>
    );}
        }

}

export default CreateAccount;