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
import {addDays} from 'date-fns';
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
 
export default class Home extends React.Component {
 
  state = {
    value: '', isOpen: false, roomNames:[],index_:null,twentyFourHourTime:undefined,
    setTwentyFourHourTime:undefined,toTwentyFourTime:undefined,toSetTwnetyFourHourTime:undefined,data:[],roomID:[],roomAvailable:[],testing:false,
  };
 
  toggle_confirm = () => {
      
      console.log("whats this",this.state.twentyFourHourTime);
      var d=new Date(this.state.twentyFourHourTime);
      
      console.log("whats that",this.setTwentyFourHourTime);
      this.writeDatabase(this.state.index_);
      
     
      this.setState({
        isOpen: !this.state.isOpen,
      });
    if(this.state.testing===null || this.state.testing===false){
    console.log("hello");
    var query = fire.firestore().collection('Rooms').where('isAvailable','==',true);
    
    var observer = query.onSnapshot(querySnapshot => {
    this.setState({testing:true}); 
    this.forceUpdate();  
    // ...
    }, err => {
    console.log(`Encountered error: ${err}`);
    });
  }else{
    this.setState({testing:false});
    this.forceUpdate();
  }
    };

  toggle = (index) => {

    this.setState({isOpen: !this.state.isOpen,
        index_:index}, function () {
            console.log("value of index",this.state);
    });  
   
  };
  componentDidUpdate(){
    console.log(this.state.testing);
  }
  handler=(twentyFourHourTime)=>{
    console.log(twentyFourHourTime)
    this.setState({setTwentyFourHourTime:twentyFourHourTime});
    console.log("time",this.state.setTwentyFourHourTime);
  }
 
  writeDatabase=(index)=>{
    console.log("index",index); 
    var isAvaiable=true;
    var d=new Date(this.state.twentyFourHourTime);
    var Hours=d.getHours();
    var Minutes=d.getMinutes();
    var x=Hours+Minutes;
    var obj={name:this.state.value, TimeStart:x};
    console.log("value",this.state.value);
    var db=fire.firestore();
    console.log("again",this.state.roomNames[index]);
    console.log("again2",this.state.roomAvailable[index]);
    db.collection('Booking').doc(this.state.roomAvailable[index].ID).set(obj);
    db.collection('Rooms').doc(this.state.roomAvailable[index].ID).update({isAvailable:true});
    
    
    
    
    
    
   /* exports.updateUser = functions.firestore
    .document('Rooms/'+this.state.roomAvailable[index].ID+'/'+this.state.roomAvailable[index].isAvaiable)
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
  


  onInputChange=(e)=>{
    this.setState({ value: e.target.value });
  }
   Changing=()=>{
 
    
   }
   
  
 
  componentDidMount(){
  const db = fire.firestore();
  
   
    var x=[];
    var y=[];
   
    db.collection('Rooms').get().then((snapshot) => {
      snapshot.forEach((doc) => {
      x.push(doc.id);
      y.push(doc.data());

      this.setState({roomAvailable:y});
      this.setState({roomNames:x});
      console.log(this.state.roomAvailable);
 
      });
    })

    .catch((err) => {
      console.log('Error getting documents', err);
    });
    
    db.collection('Rooms').where('isAvailable','==',true).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) =>{
        this.setState({data:doc.data()});
        this.setState({roomID:doc.id});
       

      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
  }
  
  render() {
   

  

    return (
      <React.Fragment>
 
        {/*modal upon "Book Now" button click*/}
        
        <Modal onClose={()=>{this.toggle(null)}} isOpen={this.state.isOpen}>
          <ModalHeader>Book Now</ModalHeader>
          <ModalBody>
 
            <this.timePicker />
            <Block as="br" />
           
            <this.timePickerTo />
            <Block as="br" />
 
            <StatefulDatepicker
            
            initialState={{value: [new Date(), addDays(new Date(), 4)]}}
            placeholder="YYYY/MM/YY" />
            <Block as="br" />
 
            <Input
              onChange={this.onInputChange}
              placeholder="Subject of Meeting"
              value={this.state.value}
            />
          </ModalBody>
          <ModalFooter>
            <ModalButton onClick={this.toggle_confirm}>Confirm Booking</ModalButton>
            <ModalButton onClick={()=>{this.toggle(null)}}>Cancel</ModalButton>
          </ModalFooter>
        </Modal>
 
        <h1>Meeting Rooms</h1>
        <FlexGrid
          flexGridColumnCount={[1, 2, 2, 2]}
          flexGridColumnGap="scale800"
          flexGridRowGap="scale800"
        >
        {this.state.roomAvailable.map((name,index)=>(
          <FlexGridItem key={index} {...itemProps}>
            <Card
              overrides={{ Root: { style: { width: '328px' } } }}
              headerImage={'https://source.unsplash.com/user/erondu/700x400'}
              title={name.ID}
            >
              <StyledAction>
                  <h1>{index}</h1>
                <Button disabled={this.state.roomAvailable[index].isAvailable} onClick={()=>{this.toggle(index)}} style={{ width: '100%' }} >Book Now</Button>
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
 
//dont call react hooks from regular js functions - only call from react function components
 