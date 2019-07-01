import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import SecondBarChart from './SecondBarChart';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import barcode from './img/barcode.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: [{"x":"Logins","y":0},{"x":"Responses","y":0},{"x":"Get QOTD","y":0},{"x":"Get results","y":0},{"x":"Questionlist","y":0}],
      endpoint: "your endpoint to the socket-io-server goes in here",
      menuValue: false,
      rest_data: [],
      rest_question_key:""
    };
  }

  handleSocketCalls(data) {
    
    this.setState( {response: data});
    
  }

  handleMenuChange(value) {

  }

  componentDidMount() {
    const { endpoint } = this.state;

    const socket = socketIOClient(endpoint);
   
    socket.on("TestWithAPI", data => this.handleSocketCalls(data,{secure:true,reconnect:true}));
  }


  render() {
    const { response } = this.state;
    return (
      
      <div style={{ textAlign: "center" }}>
      <div>
        <MuiThemeProvider>
        <AppBar
             title="C3UG Dashboard"
           />
        </MuiThemeProvider>
        
        </div>
        {response
          ? <p><center>
            <SecondBarChart data={response} />
              Total API calls during demo
              <div><img src={barcode}/></div>
              https://www.harbour-light.com/c3ug-qotd/index.html
              </center>
            </p>
            
          : <p>Loading...</p>}
      </div>
    );
  }
}
export default App;