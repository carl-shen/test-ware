import { authHeader } from '../_helpers';
import { statsDummy } from '../_constants';
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

// Initialise stats with dummy values. Note the variable names are kept short to save database and web traffic load when dealing with JSON encoded strings
function initStats(ticker, startingPortfolioValue) {
    return {
        ...statsDummy,
        ticker: ticker,
        totPortValue: startingPortfolioValue,
        fundsAvail: startingPortfolioValue,
        stPortValue: startingPortfolioValue
    };
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
        // console.log(text);

        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        } 
        
        return data;
    });
}