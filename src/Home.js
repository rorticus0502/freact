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
    const [zooms, setZooms] = useState([]);
    const [topLeftX, setTopLeftX] = useState([0]);
    const [topLeftY, setTopLeftY] = useState([0]);
    const [bottomRightX, setBottomRightX] = useState([1200]);
    const [bottomRightY, setBottomRightY] = useState([900]);
    const [minr, setMinr] = useState([-2.0]);
    const [maxr, setMaxr] = useState([1.0]);
    const [mini, setMini] = useState([-1.5]);
    const [maxi, setMaxi] = useState([1.5]);

    const login = async () => oktaAuth.signInWithRedirect();
    const logout = async () => oktaAuth.signOut('/');

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

    const handleMouseDown = (event) => {
        event.preventDefault();

        topLeftX[0] = event.nativeEvent.offsetX;
        topLeftY[0] = event.nativeEvent.offsetY;

        console.log(`mouse down ${event.nativeEvent.offsetX} ${event.nativeEvent.offsetY}`);

    }

    const handleMouseRelease = (event) => {
        event.preventDefault();

        bottomRightX[0] = event.nativeEvent.offsetX;
        bottomRightY[0] = event.nativeEvent.offsetY;

        console.log(`mouse release ${event.nativeEvent.offsetX} ${event.nativeEvent.offsetY}`);

        zoom();
    }

    const buildAZoom = (zoom) => {

        return (
            <div className="zoom-wrapper" key={zooms.length} onClick={() => reloadZoom(zoom)}>
                <div className="zoom-index">{zooms.length}.</div>
                <div className="zoom-card">
                    <div className="zoom-card-name">{zoom.name}</div>
                    <div className="zoom-card-real">{zoom.realMin} to {zoom.realMax}</div>
                    <div className="zoom-card-imaginary">{zoom.imaginaryMin} to {zoom.imaginaryMax}</div>
                </div>
            </div>
        );

    }

    const zoom = () => {

        const config = {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }

        var params = new URLSearchParams();
        params.append('toplx', topLeftX[0]);
        params.append('toply', topLeftY[0]);
        params.append('botrx', bottomRightX[0]);
        params.append('botry', bottomRightY[0]);

        params.append('minr', minr[0]);
        params.append('maxr', maxr[0]);
        params.append('mini', mini[0]);
        params.append('maxi', maxi[0]);

        var zoomUrl = 'http://localhost:8080/api/zoom?' + params.toString();

        axios.get(zoomUrl, config)
        .then(function(response) {
            setDisplay(`data:image/jpg;base64,${response.data.encodedImage}`);
            setDisplayClass('fractal-display');

            const newZooms= zooms.slice();
            newZooms.push(buildAZoom(response.data.zoom));
            setZooms(newZooms);
            setMinr([response.data.zoom.realMin]);
            setMaxr([response.data.zoom.realMax]);
            setMini([response.data.zoom.imaginaryMin]);
            setMaxi([response.data.zoom.imaginaryMax]);
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    const reloadZoom = (oldZoom) => {

        console.log('hello');

        const config = {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }

        var params = new URLSearchParams();

        params.append('minr', oldZoom.realMin);
        params.append('maxr', oldZoom.realMax);
        params.append('mini', oldZoom.imaginaryMin);
        params.append('maxi', oldZoom.imaginaryMax);

        var zoomUrl = 'http://localhost:8080/api/reload?' + params.toString();

        axios.get(zoomUrl, config)
        .then(function(response) {
            setDisplay(`data:image/jpg;base64,${response.data.encodedImage}`);
            setDisplayClass('fractal-display');

            setMinr([response.data.zoom.realMin]);
            setMaxr([response.data.zoom.realMax]);
            setMini([response.data.zoom.imaginaryMin]);
            setMaxi([response.data.zoom.imaginaryMax]);
        })
        .catch(function(error) {
            console.log(error);
        });

    }

    return (
        <div className="App-header">
            <button onClick={zoom}>Whatsitnow</button>
            <button onClick={logout}>Logout</button>
            <div id="mandelbrot-wrapper">
                <div id="fractal-wrapper">
                    <img src={display} className={displayClass} alt="logo" onMouseDown={handleMouseDown} onMouseUp={handleMouseRelease} />
                </div>
                <div id="zooms-panel-wrapper">
                    <div id="zooms-panel">
                        {zooms}
                    </div>
                </div>
            </div>
        </div>

    );

};

export default Home;