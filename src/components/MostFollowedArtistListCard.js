import React, { Component } from 'react';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Subheader from 'react-md/lib/Subheaders';

export default class MostFollowedArtistListCard extends Component {    
    render() {
        var artistList = this.props.artists.map(function(artist) {
            return <ListItem id={artist.artistName} primaryText={artist.artistName} />
        });
        
        return(
            <List>
            <Subheader primaryText={this.props.title} />
            {artistList}
            </List>
        );
    }
}
