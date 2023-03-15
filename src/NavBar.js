import { useOktaAuth } from '@okta/okta-react';
import logo from './nav-icon.jpg';

const NavBar = () => {

    const { authState, oktaAuth } = useOktaAuth();

    const logout = async () => oktaAuth.signOut('/');

    return (

        <div id="navbar">
            <div id="nav-logo" className="not-mobile">
                <img src={logo} className="not-mobile"/>
            </div>
            <div id="app-title">FractalArt</div>
            <a className="first-nav-btn not-mobile">Gallery</a>
            <a onClick={logout}>Logout</a>
        </div>

    );
};

export default NavBar;