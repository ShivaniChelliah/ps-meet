import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import fire from './config/fire'
import Home from './Home';
import SignIn from './SignIn';
import MeetingRoomStats from './MeetingRoomStats';
import CreateAccount from "./SignUp"

class App extends Component {
  state = {
    authUser: null
  };


  componentDidMount() {

    fire.auth().onAuthStateChanged((authUser) => {

      if (authUser) {

        console.log("dad", authUser);
        this.setState({ authUser: authUser });


      }
      else {
        this.setState({ authUser: null });
      }
    });

  }
  signOut() {

    fire.auth().signOut();

  }

  render() {


    console.log(this.state.authUser);
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path='/' render={() => <Home authUser={this.state.authUser} />} />
            <Route exact path='/sign-in' component={SignIn} />
            <Route exact path='/meeting-rooms-stats' component={MeetingRoomStats} />
            <Route exact path="/sign-up" component={CreateAccount} />
            <Route render={() => <h1>Page not found</h1>} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;

//<Route exact path='/rooms/:id' component={Modal} />
