
// import './App.css';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
// import { withRouter } from 'react-router';

import { history } from './helpers';
import { alertActions } from './actions';
import { PrivateRoute } from './components';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { TrainerPage } from './TrainerPage';


function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }, []);


    return (
        <div className="App">
            {alert.message &&
                <div className={`alert ${alert.type}`}>{alert.message}</div>
            }
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <PrivateRoute path="/trainer" component={TrainerPage} />
                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        
        </div>
    );


}

export default App;
