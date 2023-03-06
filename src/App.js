import React from 'react';
import { Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';


const oktaAuth = new OktaAuth({
    issuer: 'https://dev-33349446.okta.com/oauth2/default',
    clientId: '0oa8l8s5fdtUKHV9H5d7',
    redirectUri: window.location.origin + '/login/callback'
});

export default function App(props)  {

    const navigate = useNavigate();
      const restoreOriginalUri = async (_oktaAuth, originalUri) => {
        console.log('here I am');
        console.log(_oktaAuth.isAuthenticated());
        navigate('/');
      };

    const [display, setDisplay] = useState(logo);
    const [displayClass, setDisplayClass] = useState('App-logo');
    const [buttonText, setButtonText] = useState('Initialise Freactal');
    const [displayState, setDisplayState] = useState(false);




  return (
    <div className="App">

        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        <Routes>
            <Route path='/' exact={true} element=<Home /> />
            <Route path='/login/callback' element=<LoginCallback /> />
        </Routes>
        </Security>


      <header className="App-header">
        <img src={display} className={displayClass} alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Freact
        </a>
      </header>
    </div>
  );
};


