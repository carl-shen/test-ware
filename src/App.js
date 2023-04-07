import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "./sharedStyling.css";
import { history } from "./_helpers";
import { alertActions } from "./_actions";
import { PrivateRoute } from "./_components";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { TrainerPage, GuestPage } from "./TrainerPage";

function App() {
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location, action) => {
      // Clear alert on location change.
      dispatch(alertActions.clear());
    });
  }, [dispatch]);

  return (
    <div className="App">
      {alert.message && (
        <div className={`alert ${alert.type} alertCustom`}>{alert.message}</div>
      )}
      <Router history={history}>
        <Switch>
          <PrivateRoute exact path="/home" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/guest" component={GuestPage} />
          <PrivateRoute path="/trainer" component={TrainerPage} />
          <Redirect from="*" to="/home" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
