import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from 'react-md/lib/TextFields';


class LoginView extends Component {
  constructor() {
    super();
    this.state = {
      phoneNumber: '',
      password: ''
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
  }

  handleLogin() {
  }

  updatePassword(val) {
    this.state.set({
      password: val
    });
  }

  updatePhoneNumber(val) {
    this.state.set({
      phoneNumber: val
    });
  }

  

  render() {
    return(
      <div>
        <TextField
          id="phoneNumber"
          label="Phone Number"
          lineDirection="center"
          placeholder="(123)456-7890"
        onChange={updatePhoneNumber}
        />
        <TextField
          id="password"
          label="Enter your password"
          type="password"
        onChange={updatePassword}
        />

        <Button raised label="Login" onClick={handleLogin} />
      </div>
      
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
