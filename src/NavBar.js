import { useOktaAuth } from '@okta/okta-react';

const NavBar = () => {

    const { authState, oktaAuth } = useOktaAuth();

    const logout = async () => oktaAuth.signOut('/');

    return (

        <div id="navbar">
            <div id="app-title">FractalArt</div>
            <button className="first-nav-btn">Gallery</button>
            <button onClick={logout}>Logout</button>
        </div>

    );
};

export default NavBar;