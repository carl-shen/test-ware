import { statsConstants } from '../_constants';
import { statsService } from '../_services';
import { alertActions } from './';
import { userActions } from './userActions';
import config from '../_configs/configs.json';

export const statsActions = {
    fetchStats,
    postStats,
    initStats,
    updateStats
};


function rtnStatsName(userid, ticker) {
    return `${userid}-${ticker}`;
}


// GET existing stats from server, if non-exist the server will return the USE_LOCAL constant to signal client to use current local stats
function fetchStats(userid, ticker) {
    // console.log('fetching stats..');
    const statsName = rtnStatsName(userid, ticker);

    return dispatch => {
        statsService.fetchStats(statsName)
            .then(
                stats => {
                    stats = JSON.parse(stats);
                    if (stats.ticker === statsConstants.FETCH_STATS_SUCCESS_USE_LOCAL) {
                        dispatch(successUseLocal(stats));
                    } else {
                        dispatch(success(stats));
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    setTimeout(() => {
                        dispatch(alertActions.clear());
                    }, config.ALERT_TIMEOUT);
                }
            );
    };

    function success(stats) {
        // console.log(stats);
        return { type: statsConstants.FETCH_STATS_SUCCESS, stats };
    }
    function successUseLocal(stats) { return { type: statsConstants.FETCH_STATS_SUCCESS_USE_LOCAL, stats } }
    function failure(error) { return { type: statsConstants.FETCH_STATS_FAILURE, error } }
}


// Initialise a set of default stats values before stats are fetched from server
function initStats(ticker, timestamp, price) {
    // console.log('init stats..');
    const stats = statsService.initStats(ticker, timestamp, price);
    return { type: statsConstants.INIT_STATS, stats };
}


// POST local stats to server. Server will check if currIndex is newer before saving to database (anti-rollback)
function postStats(userid, ticker, stats)  {
    // console.log('posting stats..');
    const statsName = rtnStatsName(userid, ticker);

    return dispatch => {
        statsService.postStats(statsName, stats)
            .then(
                stats => {
                    dispatch(success(stats));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    // dispatch(userActions.logout());
                    setTimeout(() => {
                        dispatch(alertActions.clear());
                    }, config.ALERT_TIMEOUT);
                }
            );
    };

    function success(stats) { return { type: statsConstants.POST_STATS_SUCCESS, stats } }
    function failure(error) { return { type: statsConstants.POST_STATS_FAILURE, error } }
}


// update local copy of the stats, used to allow program to run with async POST stats
function updateStats(data) {
    // console.log('updating stats..');
    
    return {
        type: statsConstants.UPDATE_STATS_SUCCESS,
        payload: data
    };
}