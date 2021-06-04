import { authHeader } from '../_helpers';
import config from '../_configs/configs.json';


export const statsService = {
    fetchStats,
    initStats,
    postStats,
    // updateStats
};

function fetchStats(statsName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/rtnStats.php?statsName=${statsName}`, requestOptions)
        .then(handleResponse)
        .then(stats => {
            return stats;
        });
}

function initStats(ticker, timestamp, price) {
    return ({
            ticker: ticker,
            currIndex: 120,
            timestamp: timestamp,
            price: price,
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
            startingIndex: 120,
            startingPortfolioValue: 500000 
            // trades: []
    });
}

function postStats(statsName, stats)  {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify( { statsName, stats } )
    };
    // console.log(requestOptions);

    return fetch(`${config.apiUrl}/users/storeStats.php`, requestOptions).then(handleResponse);
}


function handleResponse(response) {
    return response.text().then(text => {
        console.log(text);

        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        } 
        
        return data;
    });
}