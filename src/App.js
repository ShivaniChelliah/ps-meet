import React from 'react';
import { component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import fire from './config/fire'
import Home from './Home';
import SignIn from './SignIn';





class App extends component {
  state = {
    authUser: null,
    appUser: null
  };
  componentDidMount() {

    fire.auth().onAuthStateChanged((authUser) => {

      if (authUser) {

        fire.database().ref('/users/' + authUser.uid).once('value').then((snapshot) => {

          var appUser = (snapshot.val() || null);

          if (appUser) {
            this.setState({ authUser: authUser, appUser: appUser });
          } else {
            this.setState({ authUser: authUser, appuser: null })
          }
        });
      }
      else {
        this.setState({ authUser: null, appUser: null });
      }
    });
  }
  render() {
    return (
      <BrowserRouter>
        <div>

          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/sign-in' component={SignIn} />


            <Route render={() => <h1>Page not found</h1>} />
          </Switch>

        </div>
      </BrowserRouter >
    );
  }
}


export default App;

//<Route exact path='/rooms/:id' component={Modal} />
