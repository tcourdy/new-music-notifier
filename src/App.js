import React, { Component } from 'react';
import Spotify_Logo_RGB from './Spotify_Logo_RGB_Green.png';
import './App.css';
import Button from 'react-md/lib/Buttons/Button';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import HomeView from './views/HomeView';
import { generateFetchInitPost } from './utils/Utils';

class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoginView: true,
            isUserAuthed: false
        };
        this.changeView = this.changeView.bind(this);
        this.showHomeView = this.showHomeView.bind(this);
        this.logout = this.logout.bind(this);
    }

    changeView() {
        this.setState({
            isLoginView: !this.state.isLoginView
        });
    }

    showHomeView() {
        this.setState({
            isLoginView: true,
            isUserAuthed: true
        });
    }

    logout() {
        var init = generateFetchInitPost(null);
        fetch('/logout', init)
            .then((response) => {
                if(response.ok) {
                    this.setState({
                        isLoginView: true,
                        isUserAuthed: false
                    });
                }
            });
    }
    
    render() {
        var visibleView;
        if(!this.state.isUserAuthed && this.state.isLoginView) {
            visibleView = <LoginView onLoggedIn={this.showHomeView}/>;
        } else if(!this.state.isUserAuthed) {
            visibleView = <RegisterView onRegistered={this.showHomeView}/>;
        } else {
            visibleView = <HomeView />;
        }

        return (
            <div className="App">
                <div>
                    <Button flat label="Logout"
                            className={this.state.isUserAuthed ? '' : 'hide'}
                            onClick={this.logout} />
                </div>
                <div className="App-header">
                    <img src={Spotify_Logo_RGB} className="App-logo" alt="logo" />
                    <h2>New Music Notifier</h2>
                </div>
                {visibleView}
                <div className={this.state.isUserAuthed ? 'hide' : ''}>
                    <Button flat
                            label={this.state.isLoginView ? "Register" : "Login"}
                            onClick={this.changeView}
                    />
                </div>
            </div>
        );
    }
}

export default App;
