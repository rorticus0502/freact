import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import NavBar from './NavBar';
import ZoomPanel from './ZoomPanel';

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
    const [ogScheme, setOgScheme] = useState(false);

    const login = async () => oktaAuth.signInWithRedirect();

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
    }

    const handleMouseRelease = (event) => {
        event.preventDefault();

        bottomRightX[0] = event.nativeEvent.offsetX;
        bottomRightY[0] = event.nativeEvent.offsetY;

        zoom();
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

        if(ogScheme) {
            params.append('og', true);
        }

        var zoomUrl = 'http://localhost:8080/api/zoom?' + params.toString();

        axios.get(zoomUrl, config)
        .then(function(response) {
            setDisplay(`data:image/jpg;base64,${response.data.encodedImage}`);
            setDisplayClass('fractal-display');

            const newZooms= zooms.slice();
            var newZoom = response.data.zoom;
            newZoom.index = zooms.length + 1;
            newZooms.push(newZoom);
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

        var zoomUrl = 'http://localhost:8080/api/save?' + params.toString();

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
            <NavBar />
            <div className="generator-display">
                <button onClick={zoom}>Begin</button>
                <div>
                    <input type="radio" value="og" checked={ogScheme} onChange={() => setOgScheme(!ogScheme)} />
                    <label>OG</label>
                    <input type="radio" value="latest" checked={!ogScheme} onChange={() => setOgScheme(!ogScheme)} />
                    <label>Latest</label>
                </div>

                <div>
                    <p>To generate the full Mandelbrot Set click the begin button above. Then use your mouse to zoom in.</p>
                    It can take upto 10 seconds to generate the image.

                    <p>Use the radio buttons to select your color scheme.</p>
                </div>

                <div id="mandelbrot-wrapper">
                    <div id="fractal-wrapper">
                        <img src={display} className={displayClass} alt="logo" onMouseDown={handleMouseDown} onMouseUp={handleMouseRelease} />
                    </div>
                    {zooms.length > 0 && <ZoomPanel zooms={zooms} reload={reloadZoom} />}
                </div>
            </div>
        </div>

    );
};

export default Home;