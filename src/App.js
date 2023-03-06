import React from 'react';
import { Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import './App.css';

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

  return (
    <div className="App">
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        <Routes>
            <Route path='/' exact={true} element=<Home /> />
            <Route path='/login/callback' element=<LoginCallback /> />
        </Routes>
        </Security>
    </div>
  );
};


