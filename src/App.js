import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import fire from './config/fire'
import Home from './Home';
import SignIn from './SignIn';
import MeetingRoomStats from './MeetingRoomStats';
import CreateAccount from "./SignUp"
import { Button, SHAPE } from "baseui/button";
import { StatefulMenu } from 'baseui/menu';
import ChevronDown from 'baseui/icon/chevron-right';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';

class App extends Component {
  state = {
    authUser: null,
    buttonDisplay: null,
    showMenu: false,
    ITEMS: [
      {label: "Home"},
      { label: 'View Stats' },
      { label: 'Sign Out' }
    ],
    viewStats: false,
    home: false
  };


  componentDidMount() {

    fire.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        var str = authUser.displayName;
        if (str !== null) {
          var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
          var acronym = matches.join('').toUpperCase(); // JSON
        }

        this.setState({ authUser: authUser, buttonDisplay: acronym });
      }
      else {
        this.setState({ authUser: null });
      }
    });

  }

  signOut() {
    fire.auth().signOut();
  }

  showMenu() {
    this.setState({
      showMenu: true
    })
  }

  render() {
    return (
      <BrowserRouter>
        {this.state.authUser !== null ? < div id="buttonAlign">
          <StatefulPopover
            placement={PLACEMENT.bottomLeft}
            content={({ close }) => (
              <StatefulMenu
                items={this.state.ITEMS}
                onItemSelect={(event) => close(
                  event.item.label === "Sign Out" ? this.signOut() : ((event.item.label === "View Stats")?this.setState({viewStats: true, home: false}): this.setState({home: true, viewStats: false}))
                )}
                overrides={{ List: { style: { height: '150px', width: '138px' } } }}
              />
            )}
          >
            <Button shape={SHAPE.round} endEnhancer={() => <ChevronDown size={16} />} onClick={() => { this.showMenu() }}>
              {this.state.buttonDisplay}
            </Button>
          </StatefulPopover>
        </div> : null
        }
        <div>
          <Switch>
            <Route exact path="/" render={() => <Home authUser={this.state.authUser} />} />
            <Route exact path="/sign-in" render={() => <SignIn authUser={this.state.authUser} />} />
            <Route exact path="/meeting-rooms-stats" component={MeetingRoomStats} />
            <Route exact path="/sign-up" render={() => <CreateAccount authUser={this.state.authUser} />} />
            <Route render={() => <h1>Page not found</h1>} />
          </Switch>
        </div>
        {this.state.viewStats ? <Redirect to='/meeting-rooms-stats' /> : null}
        {this.state.home ? <Redirect to="/" /> : null}
      </BrowserRouter>
    )
  }
}

export default App;

//<Route exact path='/rooms/:id' component={Modal} />
