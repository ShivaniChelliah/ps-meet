import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import fire from './config/fire';







class Chart extends Component {
  constructor() {
    super();
    this.state = {
      chartData: {}
    }
  }

  retrieveCountFirestore() {
    let db = fire.firestore();

    let cityRef = db.collection('Meeting Rooms').doc("Daily Planet").collection("1-7-2019 Bookings").doc("Booking Count");
    let getDoc = cityRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });


  }
  getChartData() {
    this.setState({
      chartData: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

        datasets: [
          {
            label: 'Daily Planet',
            backgroundColor: '#fff',
            borderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#ff0000',
            pointHoverBorderColor: 'rgba(100,110,220,1)',
            data: [
              50000,
              10000,
              30000,
              40000,
              50000,
              10
            ],

          }, {
            label: 'Y',
            data: [
              100,
              6000,
              7000,
              500,
              250,
              5000

            ],

          },
          {
            label: 'z',
            data: [
              617594,
              181045,
              153060,
              106519,
              105162,
              95072

            ],
          }, {
            label: 'w',
            data: [
              617594,
              181045,
              153060,
              106519,
              105162,
              95072

            ],
          }
        ]
      }
    });
  }

  componentDidMount() {

    this.getChartData();
    this.retrieveCountFirestore();


  }

  render() {
    return (


      <Line data={this.state.chartData} />

    );


  }





}
export default Chart;