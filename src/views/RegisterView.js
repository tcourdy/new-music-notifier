import React, { Component } from 'react';
import PhoneNumberInput from '../components/PhoneNumberInput';
import PinInput from '../components/PinInput';
import {generateFetchInitPost} from '../utils/Utils';
import Button from 'react-md/lib/Buttons/Button';
import CreateNewPassword from '../components/CreateNewPassword';
import '../App.css';


export default class RegisterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      enableRegister: false,
      showPinBox: false,
      pin: '',
      showPasswordBox: false
    };
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
    this.register = this.register.bind(this);
    this.updatePin = this.updatePin.bind(this);
    this.verifyPin = this.verifyPin.bind(this);
    this.createUser = this.createUser.bind(this);
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

  register() {
    var phoneNumber = this.state.phoneNumber.replace(/\D+/g, '');
    var body = JSON.stringify({
      phoneNumber: phoneNumber
    });
    var init = generateFetchInitPost(body);
    var self = this;
    ///sendTwilioPin
    fetch('/sendTwilioPin', init)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.result && data.result === 'Success') {
          self.setState({
            showPinBox: true,
            phoneNumber: phoneNumber
          });
        }
      });
  }

  updatePin(val) {
    this.setState({
      pin: val
    });
  }

  createUser(password) {
    var body = JSON.stringify({
      phoneNumber: this.state.phoneNumber,
      password: password
    });
    var init = generateFetchInitPost(body);
    var self = this;
    fetch('/createNewUser', init)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.result && data.result === 'Success') {
          self.props.onRegistered();
        }
      });
  }

  verifyPin() {
    var body = JSON.stringify({
      pin: this.state.pin,
      phoneNumber: this.state.phoneNumber
    });
    var init = generateFetchInitPost(body);
    var self = this;

    //verifyTwilioPin
    fetch('/verifyTwilioPin', init)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.result && data.result === 'Success') {
          self.setState({
            showPasswordBox: true
          });
        }
      });
  }

  render() {
    return(
      <div>
        <div id="registerBox"
             className={this.state.showPasswordBox ? "hide" : ""}
        >
          <div className={!this.state.showPinBox ? "" : "hide"}>
            <PhoneNumberInput            
              onChange={this.updatePhoneNumber}
            />
          </div>
          <div className={this.state.showPinBox ? "" : "hide"}>
            <PinInput 
              onChange={this.updatePin} />
          </div>
          <Button raised
                  label={this.state.showPinBox === false ? "Register" : "Verify PIN"}
                  onClick={this.state.showPinBox === false ? this.register : this.verifyPin}
                  disabled={!this.state.enableRegister}
          />
        </div>
        <div id="passwordBox"
             className={this.state.showPasswordBox ? "" : "hide"}
        >
          <CreateNewPassword onVerified={this.createUser} />
        </div>
      </div>
    );
  }
}
