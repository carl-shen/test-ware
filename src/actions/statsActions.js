import { FETCH_STATS, INIT_STATS, POST_STATS, UPDATE_STATS } from './types';

export const fetchStats = () => dispatch => {
    console.log('fetching stats..');
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(data => dispatch({
        type: FETCH_STATS,
        payload: data
    }))
}

export const initStats = () => dispatch => {
    console.log('init stats..');
    dispatch({
        type: INIT_STATS,
        payload: {
            ticker: 'stock01',
            currIndex: 120,
            timestamp: '2020-01-01',
            price: 10.0,
            totalPortfolioValue: 500000,
            fundsAvailable: 500000,
            positionHeld: 0.0,
            positionCost: 0.0,
            positionPL: 0.0,
            positionPLPercent: 0.0,
            statusText: 'Trainer initialised.',
            recentTrade1: 'most recent trade 1',
            recentTrade2: 'most recent trade 2',
            recentTrade3: 'most recent trade 3',
            recentTrade4: 'most recent trade 4',
            recentTrade5: 'most recent trade 5',
            trades: []
        }
    });
}

export const postStats = (data) => dispatch => {
    console.log('posting stats..');

    //TODO Post method

    dispatch({
        type: POST_STATS,
        payload: data
    });
}


export const updateStats = (data) => dispatch => {
    console.log('updating stats..');
    
    dispatch({
        type: UPDATE_STATS,
        payload: data
    });
}