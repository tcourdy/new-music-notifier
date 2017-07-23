import React, { Component } from 'react';
import TextField from 'react-md/lib/TextFields';

export default class PasswordInput extends Component {
  render() {
    return(
      <TextField
        label="Password"
        lineDirection="center"
        placeholder="Enter your password"
        type="password"
        onChange={(val) => this.props.onChange(val)}
      />
    );
  }
}
