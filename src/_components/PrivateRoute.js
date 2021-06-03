import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// check is user is logged in and either return login page or a route component
function PrivateRoute({ component: Component, roles, ...rest }) {
    return (
        <Route {...rest} render={props => {
            if (!localStorage.getItem('user')) {  // check if there is a 'user' object in local storage. local injection of this object will not pass JWT auth, so not a security risk
                // not logged in, redirect to login page with the return url
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            // logged in, return component
            return <Component {...props} />
        }} />
    );
}

export { PrivateRoute };