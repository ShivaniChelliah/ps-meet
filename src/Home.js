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
    selectedMeetingRoom: null,
    validateData: false,
    error: null
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

    this.setState({
      isOpen: !this.state.isOpen
    });

  }

  validateData() {
    let date, month, year;
    let timeStart = new Date(this.state.startTime).getTime();
    let timeCheckArray = [];
    let timeEnd = new Date(this.state.endTime).getTime();
    let error = null;
    let db = fire.firestore();
    
    if (timeStart > timeEnd) {
      console.log("time Start should be less than time end");

      error = "time start should be less than end time"
    }

    if (this.state.date !== null) {
      date = this.state.date.getDate();
      month = this.state.date.getMonth() + 1;
      year = this.state.date.getFullYear();
    }

    let addBookingRef = db.collection('Bookings').doc(this.state.selectedMeetingRoom.ID).collection(date + '-' + month + '-' + year + ' ' + 'Bookings');
    addBookingRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());

        timeCheckArray.push(doc.data());

      });
    }).then(() => {
      for (var i = 0, length = timeCheckArray.length; i < length; i++) {

        if (((timeStart > timeCheckArray[i].timeStart) && (timeStart < timeCheckArray[i].timeEnd)) || ((timeEnd > timeCheckArray[i].timeStart) && (timeEnd < timeCheckArray[i].timeEnd))) {
          console.log("this slot has already been booked, kindly select another slot");
          error = "this slot has already been booked, kindly select another slot";
        }
      }
    }).then(() => {
      if ((this.state.date !== null) && (this.state.startTime !== null) && (this.state.endTime !== null) && (error === null)) {
        this.setState({
          validateData: true,
          error: error
        })
      }
      else {
        this.setState({
          validateData: false,
          error: error
        })
      }

    })
  }

  toggle = (meetingRoom) => {
    this.setState({
      isOpen: !this.state.isOpen,
      selectedMeetingRoom: meetingRoom
    })
  };

  //Writes data inside database & checks if rooms are available 
  writeDatabase = (selectedMeetingRoom) => {

    let db = fire.firestore();

    let timeStart = new Date(this.state.startTime).getTime();

    let timeEnd = new Date(this.state.endTime).getTime();

    if (timeStart > timeEnd) {
      console.log("time Start should be less than time end");
    }

    let date = this.state.date.getDate();
    let month = this.state.date.getMonth() + 1;
    let year = this.state.date.getFullYear();

    let bookingInfo = { dateOfMeeting: new Date(this.state.date), subjectOfMeeting: this.state.value, timeStart: timeStart, timeEnd: timeEnd };

    let addBookingRef = db.collection('Meeting Rooms').doc(selectedMeetingRoom.ID).collection(date + '-' + month + '-' + year + ' ' + 'Bookings');

    let bookingCountRef = db.collection('Meeting Rooms').doc(selectedMeetingRoom.ID).collection(date + '-' + month + '-' + year + ' ' + 'Bookings').doc("Booking Count");

    bookingCountRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        db.runTransaction(t => {
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
      else {
        bookingCountRef.set({ bookingCount: 1 });
      }
    });

    addBookingRef.add(bookingInfo).then(() => { console.log("added booking successfully"); }).catch(() => { console.log("not added due to issues") });


  }

  saveDate = (d) => {
    this.setState({
      date: (d.date)
    }, () => {
      this.validateData();
    })

    console.log(" i am date function")

  }

  setStartTime = (time) => {
    this.setState({
      startTime: time
    }, () => {
      this.validateData();
    })
  }

  setEndTime = (time) => {
    this.setState({
      endTime: time
    }, () => {
      this.validateData()
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
            {this.state.error !== null ? this.state.error : null}
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
            <ModalButton onClick={this.confirmBooking} disabled={!(this.state.validateData) && (this.state.error !== null)}>Confirm Booking</ModalButton>
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


