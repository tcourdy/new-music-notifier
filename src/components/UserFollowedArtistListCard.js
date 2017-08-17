import React, { Component } from 'react';
import List from 'react-md/lib/Lists/List';
import ListItemControl from 'react-md/lib/Lists/ListItemControl';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Subheader from 'react-md/lib/Subheaders';
import Button from 'react-md/lib/Buttons/Button';
import { generateFetchInitPost } from '../utils/Utils';

export default class UserFollowedArtistListCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedArtistIds: new Set()
        }
        this.unfollowArtists = this.unfollowArtists.bind(this);
        this.selectArtistToUnfollow = this.selectArtistToUnfollow.bind(this);
    }

    unfollowArtists() {
        var body = JSON.stringify({
           artistIds: Array.from(this.state.selectedArtistIds)
        });

        var init = generateFetchInitPost(body);

        fetch("/unfollowArtists", init)
            .then((response) => {
                if(!response.ok) {
                    console.log("There was an error unfollowing artists");
                }
                this.props.unfollowCallback();
            });
    }

    selectArtistToUnfollow(isChecked, changeEvent) {
        var selectedArtistIds = this.state.selectedArtistIds;
        if(isChecked) {
            selectedArtistIds.add(changeEvent.target.id);
            this.setState({
                selectedArtistIds: selectedArtistIds
            });
        } else {
            selectedArtistIds.delete(changeEvent.target.id);
            this.setState({
                selectedArtistIds: selectedArtistIds
            });
        }
    }
    
    render() {
        var artistList = this.props.artists.map((artist) => {
            return <ListItemControl id={artist.artistName}
                                    primaryAction={
                                        <Checkbox
                                            id={artist.artistID}
                                               label={artist.artistName}
                                               onChange={this.selectArtistToUnfollow}
                                        />
                                    }
            />
        });
        
        return(
            <div>
                <List>
                    <Subheader primaryText={this.props.title} />
                    {artistList}
                </List>
                <Button raised label="Unfollow" onClick={this.unfollowArtists} />
            </div>
        );
    }
}
