import React, { Component } from 'react';
import './Views.scss';
import ArtistListCard from '../components/ArtistListCard';
import ArtistAutoComplete from '../components/ArtistAutoComplete';
import Button from 'react-md/lib/Buttons/Button';
import {generateFetchInitGet, generateFetchInitPost} from '../utils/Utils';

//TODO: Allow users to stop following
//TODO: Logout
export default class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostFollowed: [],
      userFollowed: [],
      followButtonEnabled: false,
      selectedArtist: ''
    }
    this.enableFollowButton = this.enableFollowButton.bind(this);
    this.followArtist = this.followArtist.bind(this);
  }

  //TODO: Is nesting appropriate here ?
  componentDidMount() {
    this.getMostFollowedArtists((data) => {
      var mostFollowedList = data;
      this.getUserFollowedArtists((data) => {
        var userFollowedList = data;
        this.setState({
          mostFollowed: mostFollowedList,
          userFollowed: userFollowedList
        });
      });
    });
  }

  enableFollowButton(artist) {
    this.setState({
      followButtonEnabled: true,
      selectedArtist: artist
    });
  }

  getMostFollowedArtists(callback) {
    var init = generateFetchInitGet();
    fetch("/mostFollowed", init)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        callback(data);
      });
  }

  getUserFollowedArtists(callback) {
    var init = generateFetchInitGet();
    fetch("/userArtistList", init)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        callback(data);
      });
  }

  followArtist() {
    var body = JSON.stringify({
      spotifyArtistID: this.state.selectedArtist.id,
      spotifyArtistName: this.state.selectedArtist.name
    });
    var init = generateFetchInitPost(body);
    fetch('/followArtist', init)
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.getUserFollowedArtists((list) => {
          this.setState({
            userFollowedList: list
          });
        });
      });
  }
  
  render() {
    return(
      <div>
        <ArtistAutoComplete onSelectArtist={this.enableFollowButton}/>
        <Button raised
                label="Follow"
                disabled={!this.state.followButtonEnabled}
                onClick={this.followArtist}
        />
        <ArtistListCard title="Top followed artists"
                        artists={this.state.mostFollowed} />
        <ArtistListCard title="Your followed artists"
                        artists={this.state.userFollowed}/>
      </div>
    );
  }
}
