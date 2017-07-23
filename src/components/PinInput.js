import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
export default class PinInput extends Component {
  render() {
    return(
      <div>
        <TextField
          label="PIN"
          lineDirection="center"
          placeholder="Enter Pin"
          helpText="A PIN has just been texted to you.  Please enter it to verify your phone number"
          onChange={(val) => this.props.onChange(val)}
        />
      </div>
    );
  }
}
