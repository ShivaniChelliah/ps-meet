import React from 'react';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Card, StyledAction } from 'baseui/card';
import { Button } from 'baseui/button';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from 'baseui/modal';
import { Input } from 'baseui/input';
import { StatefulDatepicker, TimePicker } from 'baseui/datepicker';
import { styled } from 'baseui';
import { FormControl } from 'baseui/form-control';
import fire from './config/fire';
import { addDays } from 'date-fns/esm';

const Container = styled('div', { width: '120px' });

//for flex grid item
const itemProps = {
  backgroundColor: 'mono300',
  height: 'scale3500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

class Home extends React.Component {

  state = {
    value: '',
    isOpen: false,
    roomsData: [],
    date: null,
    startTime: null,
    endTime: null,
    selectedMeetingRoom: null
  }

  componentDidMount() {
    let meetingRoomsInfo = [];  //to store rooms data
    let db = fire.firestore();

    //get all the rooms data
    db.collection('Meeting Rooms').get().then((snapshot) => {
      snapshot.forEach((doc) => {
        meetingRoomsInfo.push(doc.data());

        this.setState({ roomsData: meetingRoomsInfo });
      });
      console.log('meeting rooms info', meetingRoomsInfo);
    }).catch((err) => {
      console.log('Error getting documents', err);
    });
  }

  confirmBooking = () => {

    this.writeDatabase(this.state.selectedMeetingRoom);

    /*
    arrayUpdate.forEach((room) => {
      if (room.ID === this.state.selectedMeetingRoom.ID) {
        room.isAvailable = false;
      }
    })
    */

    this.setState({
      isOpen: !this.state.isOpen
    });

  }

  toggle = (meetingRoom) => {
    this.setState({
      isOpen: !this.state.isOpen,
      selectedMeetingRoom: meetingRoom
    })
  };

  //Writes data inside database & checks if rooms are available 
  writeDatabase = (selectedMeetingRoom) => {

    let timeStart = new Date(this.state.startTime).getTime();

    let timeEnd = new Date(this.state.endTime).getTime();

    let bookingInfo = { dateOfMeeting: new Date(this.state.date), subjectOfMeeting: this.state.value, timeStart: timeStart, timeEnd: timeEnd };

    let date = this.state.date.getDate();
    let month = this.state.date.getMonth() + 1;
    let year = this.state.date.getFullYear();

    fire.firestore().collection('Bookings').doc(selectedMeetingRoom.ID).collection(selectedMeetingRoom.ID + " " + "Bookings").add(bookingInfo);
    fire.firestore().collection('Rooms').doc(selectedMeetingRoom.ID).update({ Date: new Date(this.state.date) });

    var bookingCountRef = fire.firestore().collection('Meeting Rooms').doc(selectedMeetingRoom.ID).collection(date + '-' + month + '-' + year + ' ' + 'Bookings').doc("Booking Count");

    //fire.firestore().collection('Meeting Rooms').doc(selectedMeetingRoom.ID).collection(date+'-'+month+'-'+year+' '+'Bookings').doc("Booking Count").set({bookingCount:1}, {merge: true})

    var transaction = fire.firestore().runTransaction(t => {
      return t.get(bookingCountRef).then(doc => {
        // Add one more count to the room booking
        var newCount = doc.data().bookingCount + 1;
        t.update(bookingCountRef, { bookingCount: newCount });
      });
    })
      .then(result => {
        console.log('Transaction success!');
      })
      .catch(err => {
        console.log('Transaction failure:', err);
      });
  }

  saveDate = (d) => {
    this.setState({
      date: (d.date)
    })
  }

  setStartTime = (time) => {
    this.setState({
      startTime: time
    })
  }

  setEndTime = (time) => {
    this.setState({
      endTime: time
    })
  }

  onInputChange = (e) => {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <React.Fragment>

        <Modal onClose={() => { this.toggle(null) }} isOpen={this.state.isOpen}>
          <ModalHeader>Book Now</ModalHeader>
          <ModalBody>

            <Container>
              <FormControl label="From">
                <TimePicker
                  value={this.state.startTime}
                  onChange={(time) => { this.setStartTime(time) }}
                  creatable
                  step={900}
                />
              </FormControl>
            </Container>

            <Container>
              <FormControl label="To">
                <TimePicker
                  value={this.state.endTime}
                  onChange={(time) => { this.setEndTime(time) }}
                  creatable
                  step={900}
                />
              </FormControl>
            </Container>

            <FormControl label="Date">
              <StatefulDatepicker initialState={{ value: [new Date()] }} minDate={new Date()} maxDate={addDays(new Date(), 7)} onDayClick={(d) => { this.saveDate(d) }} />
            </FormControl>

            <FormControl label="Subject of Meeting">
              <Input
                onChange={this.onInputChange}
                placeholder="Subject of Meeting"
                value={this.state.value}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <ModalButton onClick={this.confirmBooking}>Confirm Booking</ModalButton>
            <ModalButton onClick={() => { this.toggle(null) }}>Cancel</ModalButton>
          </ModalFooter>
        </Modal>

        <h1>Meeting Rooms</h1>
        <FlexGrid
          flexGridColumnCount={[1, 2, 2, 2]}
          flexGridColumnGap="scale800"
          flexGridRowGap="scale800"
        >
          {this.state.roomsData.map((meetingRoom) => (

            <FlexGridItem key={meetingRoom.ID} {...itemProps}>
              <Card
                overrides={{ Root: { style: { width: '328px' } } }}
                headerImage={'https://source.unsplash.com/user/erondu/700x400'}
                title={meetingRoom.ID}
              >
                <StyledAction>
                  <Button onClick={() => { this.toggle(meetingRoom) }} style={{ width: '100%' }} >Book Now</Button>
                </StyledAction>
              </Card>
            </FlexGridItem>
          ))}
        </FlexGrid>
      </React.Fragment>
    );
  }
}

export default Home;

//dont call react hooks from regular js functions - only call from react function components


