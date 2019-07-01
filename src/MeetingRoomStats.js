import React from 'react';
import { styled } from 'baseui';
import fire from './config/fire';

const Container = styled('div', { width: '120px' });

class MeetingRoomStats extends React.Component {

  state = {

  }

  componentDidMount() {
      let db = fire.firestore();

    var dailyPlanetRef = db.collection('Meeting Rooms').doc('Daily Planet');
    dailyPlanetRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

  render() {
      return(
        <h1>I am the stats display for the meeting rooms</h1>
      )
      }
}

export default MeetingRoomStats;

//dont call react hooks from regular js functions - only call from react function components