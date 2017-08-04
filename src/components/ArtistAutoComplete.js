import React, { Component } from 'react';
import Autocomplete from 'react-md/lib/Autocompletes';
import {generateFetchInitGet} from '../utils/Utils';

export default class ArtistAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      enableFollowButton: false,
      selectedArtistID: ''
    }

    this.handleInput = this.handleInput.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
  }

  selectArtist(suggestion, suggestionIndex) {
    this.props.onSelectArtist(this.state.artists[suggestionIndex]);
  }

  handleInput(textInput) {
    if(textInput && textInput.length > 0) {
      var init = generateFetchInitGet();
      fetch('/searchArtists?artist=' + textInput, init)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.setState({
            artists: data
          });
        });
    }
  }

  render() {
    return(
      <div>
        <Autocomplete
          id="artists"
          type="search"
          label="Search Artists"
          className="md-cell"
          dataLabel="name"
          data={this.state.artists}
          onChange={this.handleInput}
          onAutocomplete={this.selectArtist}
        />
      </div>
    );
  }
  
}
