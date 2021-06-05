import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
import thunkMIddleware from 'redux-thunk';
import rootReducer from './_reducers';
import { loadState, saveState } from './_helpers';

// import { createLogger } from 'redux-logger';
// import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
// import process from 'process';

// const initialState = {};
const persistedState = loadState();

let selectiveCompose = compose( applyMiddleware(thunkMIddleware) );  // default to production compose
// console.log(process.env.REACT_APP_ENVIRONMENT);
// if (process.env.REACT_APP_ENVIRONMENT === 'dev') {
//     const loggerMiddleware = createLogger();
//     const middleware = [thunkMIddleware, loggerMiddleware];
//     selectiveCompose = composeWithDevTools(
//         applyMiddleware(...middleware)
//     )
// }

const store = createStore(
    rootReducer, 
    persistedState, 
    selectiveCompose
);

store.subscribe(() => {
    saveState(store.getState());
})

export default store;