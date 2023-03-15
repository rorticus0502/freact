import { useOktaAuth } from '@okta/okta-react';
import { useState, useEffect } from 'react';
import logo from './nav-icon.jpg';

const NavBar = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [accessToken, setAccessToken] = useState(null);

    const login = async () => oktaAuth.signInWithRedirect();
    const logout = async () => oktaAuth.signOut('/');

    useEffect(() => {

            if (authState && authState.isAuthenticated) {
                setAccessToken(authState.accessToken.accessToken);
            }

        }, [authState, setAccessToken]);

    return (

        <div id="navbar">
            <div id="nav-logo" className="not-mobile">
                <img src={logo} className="not-mobile"/>
            </div>
            <div id="app-title">FractalArt</div>
            <a className="first-nav-btn ls-only">Gallery</a>
            {!accessToken && <a onClick={login}>Login</a> }
            {accessToken && <a onClick={logout}>Logout</a> }
        </div>

    );
};

export default NavBar;