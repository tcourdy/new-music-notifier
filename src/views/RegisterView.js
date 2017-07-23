import React, { Component } from 'react';
import PhoneNumberInput from './components/PhoneNumberInput';
import PinInput from './components/PinInput';
import Utils from './utils/Utils';

export default class RegisterView extends Component {
  constructor() {
    super();
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
    var body = JSON.stringify({
      "phoneNumber": this.state.phoneNumber.replace(/\D+/g, '')
    });
    var init = Utils.generateFetchInit('POST', body);
    ///sendTwilioPin
    fetch('/sendTwilioPin', init)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.result && data.result === 'Success') {
          this.setState({
            showPinBox: true
          });
        }
      });
  }

  updatePin(val) {
    this.setState({
      pin: val
    });
  }

  //TODO
  createUser(password) {
    var body = JSON.stringify({
      phoneNumber: this.state.phoneNumber,
      password: password
    });
    var init = Utils.generateFetchInit('POST', body);
    //TODO: call fetch
  }

  verifyPin() {
    var body = JSON.stringify({
      pin: this.state.pin,
      phoneNumber: this.state.phoneNumber
    });
    var init = Utils.generateFetchInit('POST', body);

    //verifyTwilioPin
    fetch('/verifyTwilioPin', init)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.result && data.result === 'Success') {
          this.setState({
            showPasswordBox: true
          });
        }
      });
  }

  render() {
    return(
      <div>
        <div id="registerBox"
             class={this.showPasswordBox ? "hidden" : ""}
        >
          <PhoneNumberInput
            class={!this.showPinBox ? "" : "hidden"}
            onChange={this.updatePhoneNumber}
          />
          <PinInput class={this.showPinBox ? "" : "hidden"}
                    onChange={this.updatePin}
          />
          <Button raised
                  label={this.showPinBox === false ? "Register" : "Verify PIN"}
                  onClick={this.showPinBox === false ? this.register : this.verifyPin}
                  disabled={!this.state.enableRegister}
          />
        </div>
        <div id="passwordBox"
             class={this.showPasswordBox ? "" : "hidden"}
        >
          <CreateNewPassword onVerified={this.createUser} />
        </div>
      </div>
    );
  }
}
