import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GeneratorPanel from './GeneratorPanel';
import IntroPanel from './IntroPanel';

const Display = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [accessToken, setAccessToken] = useState(null);

    const [zooms, setZooms] = useState([]);

    const [display, setDisplay] = useState(null);

    const [topLeftX, setTopLeftX] = useState([0]);
    const [topLeftY, setTopLeftY] = useState([0]);
    const [bottomRightX, setBottomRightX] = useState([1200]);
    const [bottomRightY, setBottomRightY] = useState([900]);

    const [minr, setMinr] = useState([-2.0]);
    const [maxr, setMaxr] = useState([1.0]);
    const [mini, setMini] = useState([-1.5]);
    const [maxi, setMaxi] = useState([1.5]);

    const [ogScheme, setOgScheme] = useState(false);

    useEffect(() => {

        if (authState && authState.isAuthenticated) {
            setAccessToken(authState.accessToken.accessToken);
        }

    }, [authState, setAccessToken]);

    const zoom = () => {

        var config;
        if (accessToken) {
            config = {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
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

//        var zoomUrl = 'http://192.168.0.123:8080/api/zoom?' + params.toString();
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

        var config;

        if (accessToken) {
            config = {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
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

            setMinr([response.data.zoom.realMin]);
            setMaxr([response.data.zoom.realMax]);
            setMini([response.data.zoom.imaginaryMin]);
            setMaxi([response.data.zoom.imaginaryMax]);
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    const downloadZoom = (oldZoom) => {

        var config;

        if (accessToken) {
            config = {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }
        }

        var params = new URLSearchParams();

        params.append('minr', oldZoom.realMin);
        params.append('maxr', oldZoom.realMax);
        params.append('mini', oldZoom.imaginaryMin);
        params.append('maxi', oldZoom.imaginaryMax);

        var zoomUrl = 'http://localhost:8080/api/download?' + params.toString();

        axios.get(zoomUrl, {responseType: 'blob'})
        .then(function(response) {

                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = `freact.jpg`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

        })
        .catch(function(error) {
            console.log(error);
        });
    }

    const fingerZoom = () => {

        var config;
        if (accessToken) {
            config = {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
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

//        var zoomUrl = 'http://192.168.0.123:8080/api/zoom?' + params.toString();
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

    const handleTouchStart = (event) => {
        event.preventDefault();

        console.log(event.touches[0].clientX - event.target.x);
        console.log(event.touches[0].clientY - event.target.y);

        topLeftX[0] = event.touches[0].clientX - event.target.x;
        topLeftY[0] = event.touches[0].clientY - event.target.y;
    }

    const handleTouchEnd = (event) => {
        event.preventDefault();

        console.log(event.changedTouches[0].clientX - event.target.x);
        console.log(event.changedTouches[0].clientY - event.target.y);

        bottomRightX[0] = event.changedTouches[0].clientX - event.target.x;
        bottomRightY[0] = event.changedTouches[0].clientY - event.target.y;

        zoom();
    }

    return (
            <div id="main-display">
                {zooms.length > 0 && <GeneratorPanel
                                            zooms={zooms}
                                            display={display}
                                            handleMouseDown={handleMouseDown}
                                            handleMouseRelease={handleMouseRelease}
                                            handleTouchStart={handleTouchStart}
                                            handleTouchEnd={handleTouchEnd}
                                            reloadZoom={reloadZoom} downloadZoom = {downloadZoom} />}
                {zooms.length === 0 && <IntroPanel />}

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

    );
};

export default Display;