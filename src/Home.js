import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import GeneratorPanel from './GeneratorPanel';
import IntroPanel from './IntroPanel';

const Home = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [accessToken, setAccessToken] = useState(null);
    const [display, setDisplay] = useState(null);
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
                <p>Yo</p>
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
                <div className="tagline not-mobile">
                    Create your own beautiful and unique art.
                </div>

                {zooms.length > 0 && <GeneratorPanel zooms={zooms} handleMouseDown={handleMouseDown} handleMouseRelease={handleMouseRelease} zoom={zoom} reloadZoom={reloadZoom} display={display} />}
                {zooms.length== 0 && <IntroPanel />}

                <div id="control-panel">
                    <div>
                        <button onClick={zoom}>Begin</button>
                    </div>
                    <div>
                        <div>
                            <label>Original</label>
                        </div>
                        <div>
                            <input type="radio" value="og" checked={ogScheme} onChange={() => setOgScheme(!ogScheme)} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <label>Latest</label>
                        </div>
                        <div>
                            <input type="radio" value="latest" checked={!ogScheme} onChange={() => setOgScheme(!ogScheme)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Home;