import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import ZoomCard from './ZoomCard';

const Home = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [accessToken, setAccessToken] = useState(null);
    const [display, setDisplay] = useState(logo);
    const [displayClass, setDisplayClass] = useState('App-logo');
    const [zoomName, setZoomName] = useState(null);
    const [realRange, setRealRange] = useState(null);
    const [iRange, setiRange] = useState(null);
    const [zooms, setZooms] = useState([]);

    const login = async () => oktaAuth.signInWithRedirect();
    const logout = async () => oktaAuth.signOut('/');

    var  findOut = () => {

            const config = {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }

            axios.get('http://localhost:8080/api/init', config)
                    .then(function(response) {
                        console.log(response);
                        setDisplay(`data:image/jpg;base64,${response.data.encodedImage}`);
                        setDisplayClass('fractal-display');
                        setZoomName(response.data.zoom.name);
                        setRealRange(`${response.data.zoom.realMin} to ${response.data.zoom.realMax}`);
                        setiRange(`${response.data.zoom.imaginaryMin} to ${response.data.zoom.imaginaryMax}`);


                        const newZooms= zooms.slice();
                        newZooms.push(<div>hello</div>);
                        setZooms(newZooms);

                    })
                    .catch(function(error) {
                        console.log(error);
                    });

        };

    useEffect(() => {

        if (authState && authState.isAuthenticated) {
            setAccessToken(authState.accessToken.accessToken);
        }

    }, [authState, setAccessToken]);

    if (!accessToken) {
        return (
            <div>
                <p>Hey</p>
                <button onClick={login}>Click to Login</button>
            </div>
        );
    }

    return (
        <div class="App-header">
            <button onClick={findOut}>Whatsitnow</button>
            <button onClick={logout}>Logout</button>
            <div id="mandelbrot-wrapper">
                <div id="fractal-wrapper">
                    <img src={display} className={displayClass} alt="logo" />
                </div>
                <div id="zooms-panel-wrapper">
                    <div id="zooms-panel">
                        <div className="zoom-wrapper">
                            {zooms}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

};

export default Home;