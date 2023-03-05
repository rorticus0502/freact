import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';

export default function App(props) {

    const [display, setDisplay] = useState(logo);
    const [displayClass, setDisplayClass] = useState('App-logo');
    const [buttonText, setButtonText] = useState('Initialise Freactal');
    const [displayState, setDisplayState] = useState(false);

  function handleClick() {

    axios.get('http://localhost:8080/api/init')
        .then(function(response) {
            if (displayState) {
                console.log('on');
                setDisplay(logo);
                setDisplayClass('App-logo');
                setButtonText('Initialise Freactal');
            } else {
                console.log('off');
                setDisplay(`data:image/jpg;base64,${response.data.encodedImage}`);
                setDisplayClass('fractal-display');
                setButtonText('Go React!');
            }
            setDisplayState(!displayState);
        })
        .catch(function(error) {
            console.log(error);
        });

  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={display} className={displayClass} alt="logo" />
        <button onClick={handleClick}>{buttonText}</button>
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
}


