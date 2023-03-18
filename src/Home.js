import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Display from './Display';
import GeneratorPanel from './GeneratorPanel';
import IntroPanel from './IntroPanel';

const Home = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [accessToken, setAccessToken] = useState(null);
    const [ogScheme, setOgScheme] = useState(false);

    useEffect(() => {

        if (authState && authState.isAuthenticated) {
            setAccessToken(authState.accessToken.accessToken);
        }

    }, [authState, setAccessToken]);

    return (
        <div className="App-header">
            <NavBar />
            <div className="generator-display">
                <div className="tagline not-mobile">
                    Create your own beautiful and unique art.
                </div>

                <Display />

            </div>
        </div>

    );
};

export default Home;