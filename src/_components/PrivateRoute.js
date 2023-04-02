import React from "react";
import { Route, Redirect } from "react-router-dom";

// Check if the user is logged in and conditionally return either return login page or a route component.
function PrivateRoute({ component: Component, roles, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!localStorage.getItem("user")) {
          // Simply checks if there is a "user" object in local storage.
          // Local injection of this object will not pass the JWT auth, hence not a security risk.
          // If a "user" object is not present, redirect to the login page with the return url.
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        // User is logged in, return component.
        return <Component {...props} />;
      }}
    />
  );
}

export { PrivateRoute };
