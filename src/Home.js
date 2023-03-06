import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [accessToken, setAccessToken] = useState(null);

    const login = async () => oktaAuth.signInWithRedirect();
    const logout = async () => oktaAuth.signOut('/');

    var  findOut = () => {

                                    const config = {
                                        headers: {
                                            Authorization: 'Bearer ' + accessToken
                                        }
                                    }

                                    axios.get('http://localhost:8080/api/ufo', config)
                                            .then(function(response) {
                                                console.log(response);
                                            })
                                            .catch(function(error) {
                                                console.log(error);
                                            });

                                };

    useEffect(() => {


            if(!authState) {

                console.log("nothin t see");
                setAccessToken(null);
            } else if (authState.isAuthenticated) {

                console.log("sommat lets see");
                console.log(authState.accessToken.accessToken);
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
        <div>
            <p>Hello</p>
            <button onClick={findOut}>Whatsitnow</button>
            <button onClick={logout}>Logout</button>
        </div>

    );

};

export default Home;