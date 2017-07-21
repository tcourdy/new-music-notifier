import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';


class PhoneNumberInput extends Component {
  render() {
    return(
        <TextField
          label="Phone Number"
          lineDirection="center"
          placeholder="(123)456-7890"
          value={this.props.value}
          type="tel"
          onChange={(val) => this.props.onChange(val)}
        />
    );
  }
}

class PasswordInput extends Component {
  render() {
    return(
      <TextField
        label="Password"
        lineDirection="center"
        placeholder="Enter your password"
        value={this.props.value}
        type="password"
        onChange={() => this.props.onChange()}
      />
    );
  }
}


class RegisterView extends Component {
  constructor() {
    super();
    this.state = {
      phoneNumber: '',
      enableRegister: false
    };
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
    this.register = this.register.bind(this);
  }

  updatePhoneNumber(val) {
    var phone = val.replace(/\D+/g, '');
    if(phone.length === 10 && !Number.isNaN(Number.parseInt(phone, 10))) {
      this.setState({
        phoneNumber: val,
        enableRegister: true
      });
    } else {
      this.setState({
        phoneNumber: val,
        enableRegister: false
      });
    }
  }

  //TODO
  register() {
    var init = {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "phoneNumber": this.state.phoneNumber.replace(/\D+/g, '')
      })
    };
    ///sendTwilioPin
    fetch('/sendTwilioPin', init)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
      });
  }

  render() {
    return(
      <div>
        <PhoneNumberInput onChange={this.updatePhoneNumber} />
        <Button raised
                label="Register"
                onClick={this.register}
                disabled={!this.state.enableRegister}
        />
      </div>
    );
  }
}

class LoginView extends Component {
  constructor() {
    super();
    this.state = {
      phoneNumber: '',
      password: '',
      enableLogin: false
    };

    this.login = this.login.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
  }

  //TODO:
  login() {
  }

  updatePassword(val) {
    if(val
       && this.state.phoneNumber
       && this.state.phoneNumber.replace(/\D+/g, '')){
      this.setState({
        password: val,
        enableLogin: true
      });
    } else {
      this.setState({
        password: val
      });
    }
  }

  updatePhoneNumber(val) {
    var phone = val.replace(/\D+/g, '');
    if(phone.length === 10 && !Number.isNaN(Number.parseInt(phone, 10))
       && this.state.password) {
      this.setState({
        phoneNumber: val,
        enableLogin: true
      });
    } else {
      this.setState({
        phoneNumber: val,
        enableLogin: true
      });
    }
  }

  render() {
    return(
      <div>
        <PhoneNumberInput onChange={this.updatePhoneNumber} />
        <PasswordInput onChange={this.updatePassword} />
        <Button raised
                label="Login"
                onClick={this.login}
                disabled={!this.state.enableLogin}
        />
      </div>
    );
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      isLoginView: true
    }
    this.changeView = this.changeView.bind(this);
  }

  changeView() {
    this.setState({
      isLoginView: !this.state.isLoginView
    })
  }
  
  render() {
    var visibleView;
    if(this.state.isLoginView) {
      visibleView = <LoginView/>
    } else {
      visibleView = <RegisterView/>
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to New Music Notifier</h2>
        </div>
        {visibleView}
        <Button flat label={this.state.isLoginView ? "Register" : "Login"} onClick={this.changeView} />
      </div>
    );
  }
}

export default App;
