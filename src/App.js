import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './Home';
import MeetingRoomStats from './MeetingRoomStats';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/meeting-rooms-stats' component={MeetingRoomStats} />
          <Route render={() => <h1>Page not found</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
 
export default App;

//<Route exact path='/rooms/:id' component={Modal} />
