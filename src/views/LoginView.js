import React, { Component } from 'react';
import PhoneNumberInput from './components/PhoneNumberInput';
import PasswordInput from './components/PasswordInput';
import Utils from './utils/Utils';

export default class LoginView extends Component {
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

  login() {
    var body = JSON.stringify({
      userPhone: this.state.phoneNumber.replace(/\D+/g, ''),
      password: this.state.password
    });
    var init = Utils.generateFetchInit('POST', body);
    fetch('/login', init)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.result && data.result === 'Success') {
          this.props.onLoggedIn();
        }
      })
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
