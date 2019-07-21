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
import { Redirect } from 'react-router';

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
    error: null,
    bookMeetingRoom: true
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
    if ((this.state.date !== null) && (this.state.startTime !== null) && (this.state.endTime !== null)) {
      //date
      let date = this.state.date.getDate();
      let month = this.state.date.getMonth() + 1;
      let year = this.state.date.getFullYear();

      //time
      let timeStart = new Date(this.state.startTime).getTime();
      let timeCheckArray = [];
      let timeStartArray = [];
      let timeEndArray = [];
      let timeEnd = new Date(this.state.endTime).getTime();

      let minTime, maxTime;

      let error1 = '';
      let error2 = '';

      let db = fire.firestore();
      let addBookingRef = db.collection('Meeting Rooms').doc(this.state.selectedMeetingRoom.ID).collection(date + '-' + month + '-' + year + ' ' + 'Bookings');

      if (timeStart >= timeEnd) {
        error1 = "Start time should be less than end time."
      }

      addBookingRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          if (doc.id !== 'Booking Count') {
            timeCheckArray.push(doc.data());
          }
        });
      }).then(() => {
        for (var i = 0, length = timeCheckArray.length; i < length; i++) {
          if ((timeStart >= timeCheckArray[i].timeStart) && (timeStart <= timeCheckArray[i].timeEnd)) {
            timeStartArray.push(timeCheckArray[i].timeStart);
            timeEndArray.push(timeCheckArray[i].timeEnd);
            error2 = "error";
          }
          if ((timeEnd >= timeCheckArray[i].timeStart) && (timeEnd <= timeCheckArray[i].timeEnd)) {
            timeEndArray.push(timeCheckArray[i].timeEnd);
            timeStartArray.push(timeCheckArray[i].timeStart);
            error2 = "error";
          }
          if ((timeCheckArray[i].timeStart >= timeStart) && (timeCheckArray[i].timeStart <= timeEnd)) {
            timeStartArray.push(timeCheckArray[i].timeStart);
            error2 = "error";
          }
          if ((timeCheckArray[i].timeEnd >= timeStart) && (timeCheckArray[i].timeEnd <= timeEnd)) {
            timeEndArray.push(timeCheckArray[i].timeEnd);
            error2 = "error";
          }
        }
        if (error2 === "error") {
          if ((timeStartArray.length === 0) && (timeEndArray.length !== 0)) {
            maxTime = Math.max.apply(null, timeEndArray);
            minTime = Math.min.apply(null, timeEndArray);
          }
          else if ((timeStartArray.length !== 0) && (timeEndArray.length === 0)) {
            minTime = Math.min.apply(null, timeStartArray);
            maxTime = Math.max.apply(null, timeStartArray);
          }
          else if ((timeStartArray.length !== 0) && (timeEndArray.length !== 0)) {
            minTime = Math.min.apply(null, timeStartArray);
            maxTime = Math.max.apply(null, timeEndArray);
          }

          var minTimeGen = new Date(minTime);
          minTime = (minTimeGen.getHours() + ":" + minTimeGen.getMinutes());

          var maxTimeGen = new Date(maxTime);
          maxTime = (maxTimeGen.getHours() + ":" + maxTimeGen.getMinutes());

          error2 = `The slot from ${minTime} to ${maxTime} has already been booked. Kindly select another slot`;
        }
      }).then(() => {
        if ((error1 === '') && (error2 === '')) {
          this.setState({
            validateData: true,
            error: null
          })
        }
        else {
          this.setState({
            validateData: false,
            error: error1 + " " + error2
          })
        }
      })
    }
  }

  toggle = (meetingRoom) => {
    if (this.props.authUser) {
      this.setState({
        isOpen: !this.state.isOpen,
        selectedMeetingRoom: meetingRoom,
        bookMeetingRoom: true
      })
    }
    else
      this.setState({
        bookMeetingRoom: false
      })
  };

  //Writes data inside database & checks if rooms are available 
  writeDatabase = (selectedMeetingRoom) => {

    let db = fire.firestore();

    let timeStart = new Date(this.state.startTime).getTime();

    let timeEnd = new Date(this.state.endTime).getTime();

    let date = this.state.date.getDate();
    let month = this.state.date.getMonth() + 1;
    let year = this.state.date.getFullYear();

    let bookingInfo = { dateOfMeeting: new Date(this.state.date), subjectOfMeeting: this.state.value, timeStart: timeStart, timeEnd: timeEnd };

    let addBookingRef = db.collection("Meeting Rooms").doc(selectedMeetingRoom.ID).collection(date + '-' + month + '-' + year + ' ' + 'Bookings');

    let bookingCountRef = db.collection("Meeting Rooms").doc(selectedMeetingRoom.ID).collection(date + '-' + month + '-' + year + ' ' + 'Bookings').doc("Booking Count");

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
    if (this.state.bookMeetingRoom) {
      return (
        <React.Fragment>
          <Modal onClose={() => { this.toggle(null) }} isOpen={this.state.isOpen}>
            <ModalHeader>Book Now</ModalHeader>
            <ModalBody>
              {this.state.error !== null ? <p className="error">{this.state.error}</p> : null}
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
              <ModalButton onClick={this.confirmBooking} disabled={!((this.state.validateData) && (this.state.error === null))}>Confirm Booking</ModalButton>
              <ModalButton onClick={() => { this.toggle(null) }}>Cancel</ModalButton>
            </ModalFooter>
          </Modal>

          <h1>Meeting Rooms</h1>
          <FlexGrid
            flexGridColumnCount={[1, 1, 2, 2]}
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
    else {
      return <Redirect to='/sign-in' />
    }
  }
}


export default Home;

//dont call react hooks from regular js functions - only call from react function components