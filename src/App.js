import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import fire from './config/fire'
import Home from './Home';
import SignIn from './SignIn';
import Chart from './Chart';
import MeetingRoomStats from './MeetingRoomStats';
import CreateAccount from "./SignUp"
import { Button, SHAPE } from "baseui/button";
import { StatefulMenu } from 'baseui/menu';
import ChevronDown from 'baseui/icon/chevron-right';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import { Redirect } from 'react-router'
import Schedule from './Schedule';

class App extends Component {
  state = {
    authUser: null,
    buttonDisplay: null,
    showMenu: false,
    ITEMS: [
      { label: 'Help' },
      { label: 'Sign Out' }

    ]
  };


  componentDidMount() {

    fire.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("dad", authUser);

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
                  event.item.label === "Sign Out" ? this.signOut() : null
                )}
                overrides={{ List: { style: { height: '78px', width: '138px' } } }}
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
            <Route exact path="/charts" render={() => <Chart authUser={this.state.authUser} />} />
            <Route exact path="/schedule" render={() => <Schedule authUser={this.state.authUser} />} />


            <Route render={() => <h1>Page not found</h1>} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;

//<Route exact path='/rooms/:id' component={Modal} />
