import React, { Component } from 'react';
import List from 'react-md/lib/Lists/List';
import ListItemControl from 'react-md/lib/Lists/ListItemControl';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

export default class ArtistListCard extends Component {
  render() {
    var artistList = this.props.artists.map(function(artist) {
      return <ListItemControl id={artist.artistName}
                              primaryAction={
                                <Checkbox id={artist.artistName}
                                             label={artist.artistName}
                                             defaultChecked
                                />
                              }
      />
    });
    return(
      <List>
        {artistList}
      </List>
    );
  }
}
