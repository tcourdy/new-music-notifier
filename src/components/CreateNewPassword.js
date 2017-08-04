import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

export default class CreateNewPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      doPasswordsMatch: false
    };

    this.updatePassword = this.updatePassword.bind(this);
    this.verifyPassword = this.verifyPassword.bind(this);
    this.sendPassword = this.sendPassword.bind(this);
  }

  updatePassword(val) {
    this.setState({
      password: val
    });
  }

  verifyPassword(val) {
    if(val === this.state.password) {
      this.setState({
        doPasswordsMatch: true
      });
    } else {
      this.setState({
        doPasswordsMatch: false
      });
    }
  }

  sendPassword() {
    this.props.onVerified(this.state.password);
  }
  
  
  render() {
    return(
      <div>
        <TextField
          label="Password"
          lineDirection="center"
          placeholder="Enter your password"
          type="password"
          onChange={this.updatePassword}
        />

        <TextField
          label="Enter Password Again"
          lineDirection="center"
          placeholder="Enter your password again"
          type="password"
          onChange={this.verifyPassword}
        />

        <Button flat label="Create Password"
                disabled={!this.state.doPasswordsMatch}
                onClick={this.sendPassword}
        />
      </div>
    );
  }
}
