import { useOktaAuth } from '@okta/okta-react';
import logo from './vsm-icon.jpg';

const NavBar = () => {

    const { authState, oktaAuth } = useOktaAuth();

    const logout = async () => oktaAuth.signOut('/');

    return (

        <div id="navbar">
            <div id="nav-logo">
                <img src={logo} />
            </div>
            <div id="app-title">FractalArt</div>
            <a className="first-nav-btn">Gallery</a>
            <a onClick={logout}>Logout</a>
        </div>

    );
};

export default NavBar;