import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-md/lib/Buttons/Button';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import HomeView from './views/HomeView';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoginView: true,
      isUserAuthed: false
    }
    this.changeView = this.changeView.bind(this);
    this.showHomeView = this.showHomeView.bind(this);
  }

  changeView() {
    this.setState({
      isLoginView: !this.state.isLoginView
    })
  }

  showHomeView() {
    this.setState({
      isLoginView: true,
      isUserAuthed: true
    });
  }
  
  render() {
    var visibleView;
    if(!this.isUserAuthed && this.state.isLoginView) {
      visibleView = <LoginView onLoggedIn={this.showHomeView}/>;
    } else if(!this.isUserAuthed) {
      visibleView = <RegisterView onRegistered={this.showHomeView}/>;
    } else {
      visibleView = <HomeView />; //TODO: create home view
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to New Music Notifier</h2>
        </div>
        {visibleView}
        <Button flat
                class={this.isUserAuthed ? 'hidden' : ''}
                label={this.state.isLoginView ? "Register" : "Login"}
                onClick={this.changeView}
        />
      </div>
    );
  }
}

export default App;
