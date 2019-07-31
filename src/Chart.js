import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import fire from './config/fire';

class Chart extends Component {
  constructor() {
    super();
    this.state = {
      dataDailyPlanet: null,
      dataHoj: null,
      dataKrypto: null,
      dataMetropolosis: null,
      chartData: {}
    }
  }

  retrieveCountFirestore() {
    let db = fire.firestore();
    var data;
    let dailyPlanetRef = db.collection('Meeting Rooms').doc("Daily Planet").collection("Booking Count").doc("DaysCount");
    let getDoc = dailyPlanetRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          if (this.state.docDataDailyPlanet !== null) {
            this.setState({ dataDailyPlanet: doc.data() });
          }
          console.log(this.state.dataDailyPlanet);
          console.log('Document data:', doc.data());
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    let hojRef = db.collection('Meeting Rooms').doc("HOJ").collection("Booking Count").doc("DaysCount");
    let getDocHoj = hojRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          this.setState({ dataHoj: doc.data() });
          console.log(this.state.dataHoj);

          console.log('Document data:', doc.data());
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });

    let kryptonRef = db.collection('Meeting Rooms').doc("Krypton").collection("Booking Count").doc("DaysCount");
    let getDocKyrpton = kryptonRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          this.setState({ dataKrypto: doc.data() });
          console.log(this.state.dataKrypto);


        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    let metropolisRef = db.collection('Meeting Rooms').doc("Metropolis").collection("Booking Count").doc("DaysCount");
    let getDocMetropolis = metropolisRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          console.log(this.state.dataDailyPlanet);

          this.setState({ dataMetropolosis: doc.data() });
          console.log(this.state.dataMetropolosis);

          this.getChartData(this.state.dataDailyPlanet, this.state.dataHoj, this.state.dataKrypto, this.state.dataMetropolosis);


        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });




  }

  getChartData(docDataDailyPlanet, dataHoj, dataKrypto, dataMetropolosis) {
    if (this.state.dataDailyPlanet !== null) {

      this.setState({
        chartData: {
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],

          datasets: [
            {
              label: 'Daily Planet',
              backgroundColor: '#fff',
              borderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#ff0000',
              pointHoverBorderColor: 'rgba(100,110,220,1)',
              data: [
                docDataDailyPlanet.Sunday,
                docDataDailyPlanet.Monday,
                docDataDailyPlanet.Tuesday,
                docDataDailyPlanet.Wednesday,
                docDataDailyPlanet.Thursday


              ],

            }, {
              label: 'HOJ',
              data: [
                dataHoj.Sunday,
                dataHoj.Monday,
                dataHoj.Tuesday,
                dataHoj.Wednesday,
                dataHoj.Thursday

              ],

            },
            {
              label: 'Krypto',
              data: [
                dataKrypto.Sunday,
                dataKrypto.Monday,
                dataKrypto.Tuesday,
                dataKrypto.Wednesday,
                dataKrypto.Thursday

              ],
            }, {
              label: 'Metropolosis',
              data: [
                dataMetropolosis.Sunday,
                dataMetropolosis.Monday,
                dataMetropolosis.Tuesday,
                dataMetropolosis.Wednesday,
                dataMetropolosis.Thursday

              ],
            }
          ]
        }
      });
    }
  }

  componentDidMount() {
    this.retrieveCountFirestore();




  }

  render() {
    return (


      <Line data={this.state.chartData} />

    );


  }





}
export default Chart;