import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';
export default class PhoneNumberInput extends Component {
  render() {
    return(
      <TextField
        label="Phone Number"
        lineDirection="center"
        placeholder="(123)456-7890"
        type="tel"
        onChange={(val) => this.props.onChange(val)}
      />
    );
  }
}
