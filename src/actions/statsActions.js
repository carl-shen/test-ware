import { statsConstants } from '../constants';

export const statsActions = {
    fetchStats,
    postStats,
    initStats,
    updateStats
};

function fetchStats() {
    console.log('fetching stats..');
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(data => {
        return {
            type: statsConstants.FETCH_STATS,
            payload: data
        };
    });
}

function initStats() {
    console.log('init stats..');
    return {
        type: statsConstants.INIT_STATS,
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
    };
}

function postStats(data)  {
    console.log('posting stats..');

    //TODO Post method

    return {
        type: statsConstants.POST_STATS,
        payload: data
    };
}


function updateStats(data) {
    console.log('updating stats..');
    
    return {
        type: statsConstants.UPDATE_STATS,
        payload: data
    };
}