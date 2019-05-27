import React, { useState } from 'react';
import { FlexGrid, FlexGridItem } from '../node_modules/baseui/flex-grid';
import { Card, StyledAction } from '../node_modules/baseui/card';
import { Button } from '../node_modules/baseui/button';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from '../node_modules/baseui/modal';
import { Input } from 'baseui/input';
import { StatefulDatepicker, TimePicker } from '../node_modules/baseui/datepicker';
import { Block } from 'baseui/block';
import { styled } from 'baseui';
import { FormControl } from 'baseui/form-control';
import fire from './config/fire';

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
    roomNames: [],
    index_: null,
    twentyFourHourTime: undefined,
    setTwentyFourHourTime: undefined,
    toTwentyFourTime: undefined,
    toSetTwnetyFourHourTime: undefined,
    data: [],
    roomID: [],
    roomsData: []
  }

  componentDidMount() {
    const db = fire.firestore();

    var y = [];  //to store rooms data

    //get all the rooms data
    db.collection('Rooms').get().then((snapshot) => {
      snapshot.forEach((doc) => {

        y.push(doc.data());

        console.log("y", y);

        this.setState({ roomsData: y });

        console.log(this.state.roomsData);
      });
    })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

    //get the data of rooms which are not available
    db.collection('Rooms').where('isAvailable', '==', false).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        this.setState({ data: doc.data(), roomID: doc.id });

      });
    })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
  }

  toggle_confirm = () => {
    var arrayUpdate = this.state.roomsData;

    const db = fire.firestore();
    console.log("whats this", this.state.twentyFourHourTime);
    var d = new Date(this.state.twentyFourHourTime);

    console.log("whats that", this.setTwentyFourHourTime);
    this.writeDatabase(this.state.index_);

    var query = fire.firestore().collection('Rooms').where('isAvailable', '==', false);

    query.onSnapshot(querySnapshot => {
      db.collection('Rooms').doc(this.state.roomsData[this.state.index_].ID).update({ isAvailable: false });
    }, err => {
      console.log(`Encountered error: ${err}`);
    });

    for (var i = 0; i < this.state.roomsData.length; i++) {
      if (i === this.state.index_) {
        arrayUpdate[i].isAvailable = false;
      }

    }

    this.setState({
      isOpen: !this.state.isOpen,
      roomsData: arrayUpdate
    });
    console.log("i am now booked rooms info", this.state.roomsData[this.state.index_]);
  }


  toggle = (index) => {

    this.setState({
      isOpen: !this.state.isOpen,
      index_: index
    }, function () {
      console.log("value of index", this.state);
    });

  };

  handler = (twentyFourHourTime) => {
    console.log(twentyFourHourTime)
    this.setState({ setTwentyFourHourTime: twentyFourHourTime });
    console.log("time", this.state.setTwentyFourHourTime);
  }

  //Writes data inside database & checks if rooms are available 
  writeDatabase = (index) => {
    console.log("index", index);

    var d = new Date(this.state.twentyFourHourTime);
    var Hours = d.getHours();
    var Minutes = d.getMinutes();
    var x = Hours + Minutes;
    var obj = { name: this.state.value, TimeStart: x };
    console.log("value", this.state.value);
    var db = fire.firestore();
    console.log("again", this.state.roomNames[index]);
    console.log("again2", this.state.roomsData[index]);
    db.collection('Booking').doc(this.state.roomsData[index].ID).set(obj);
    db.collection('Rooms').doc(this.state.roomsData[index].ID).update({ isAvailable: false });




    /* exports.updateUser = functions.firestore
     .document('Rooms/'+this.state.roomsData[index].ID+'/'+this.state.roomsData[index].isAvaiable)
     .onUpdate((change, context) => {
       // Get an object representing the document
       // e.g. {'name': 'Marie', 'age': 66}
       const newValue = change.after.data();
 
       // ...or the previous value before this update
       const previousValue = change.before.data();
       if(newValue===previousValue){
         return null;
       }
 
       // access a particular field as you would any JS property
       const name = newValue.isAvaiable;
       return change.after.document.update({newValue})
       // perform desired operations ...
     })*/

  }

  timePicker = () => {
    [this.state.twentyFourHourTime, this.state.setTwentyFourHourTime] = useState(null);

    return (
      <Container>
        <FormControl label="From">
          <TimePicker
            value={this.state.twentyFourHourTime}
            onChange={this.state.setTwentyFourHourTime}
            format="24"
            step={1800}
          />
        </FormControl>
      </Container>
    );
  }

  timePickerTo = () => {
    [this.state.toTwentyFourTime, this.state.toSetTwnetyFourHourTime] = useState(null);

    return (
      <Container>
        <FormControl label="To">
          <TimePicker
            value={this.state.toTwentyFourTime}
            onChange={this.state.toSetTwnetyFourHourTime}
            format="24"
            step={1800}
          />
        </FormControl>
      </Container>
    );
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

            <this.timePicker />
            <Block as="br" />

            <this.timePickerTo />
            <Block as="br" />

            <StatefulDatepicker />
            <Block as="br" />

            <Input
              onChange={this.onInputChange}
              placeholder="Subject of Meeting"
              value={this.state.value}
            />
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={this.toggle_confirm}>Confirm Booking</ModalButton>
            <ModalButton onClick={() => { this.toggle(null) }}>Cancel</ModalButton>
          </ModalFooter>
        </Modal>

        <h1>Meeting Rooms</h1>
        <FlexGrid
          flexGridColumnCount={[1, 2, 2, 2]}
          flexGridColumnGap="scale800"
          flexGridRowGap="scale800"
        >
          {this.state.roomsData.map((name, index) => (

            <FlexGridItem key={index} {...itemProps}>
              <Card
                overrides={{ Root: { style: { width: '328px' } } }}
                headerImage={'https://source.unsplash.com/user/erondu/700x400'}
                title={name.ID}
              >
                <StyledAction>
                  <h1>{index}</h1>
                  <Button disabled={!(this.state.roomsData[index].isAvailable)} onClick={() => { this.toggle(index) }} style={{ width: '100%' }} >Book Now</Button>
                </StyledAction>
              </Card>
            </FlexGridItem>
          ))}
        </FlexGrid>
      </React.Fragment>
    );
    //}

  }

}

export default Home;

//dont call react hooks from regular js functions - only call from react function components
