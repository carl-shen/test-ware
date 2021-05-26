import { combineReducers } from 'redux';

import { stats } from './statsReducer';
import { authentication } from './authenticationReducer';
import { registration } from './registrationReducer';
import { users } from './userReducer';
import { alert } from './alertReducer';

const rootReducer = combineReducers({
    stats: stats,
    authentication: authentication,
    registration: registration,
    users: users,
    alert: alert
});

export default rootReducer;
