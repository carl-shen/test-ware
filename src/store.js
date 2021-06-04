import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import thunkMIddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './_reducers';
import { loadState, saveState } from './_helpers';

const initialState = {};
const persistedState = loadState();

// const middleware = [thunkMIddleware];

const loggerMiddleware = createLogger();
const middleware = [thunkMIddleware, loggerMiddleware];

const store = createStore(
    rootReducer, 
    persistedState, 
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

store.subscribe(() => {
    saveState(store.getState());
})

export default store;