import { StatsConstants } from "../_constants";
import { statsService } from "../_services";
import { alertActions } from "./";
import { rtnStatsName } from "../_helpers";
import config from "../_configs/configs.json";

export const statsActions = {
  fetchStats,
  postStats,
  initStats,
  updateStats,
};

// Get existing "stats" data from server. If this is not available, the server will return the USE_LOCAL constant to signal client to use current local "stats".
function fetchStats(userid, ticker) {
  const statsName = rtnStatsName(userid, ticker);

  return (dispatch) => {
    statsService.fetchStats(statsName).then(
      (stats) => {
        stats = JSON.parse(stats);
        if (stats.ticker === StatsConstants.FETCH_STATS_SUCCESS_USE_LOCAL) {
          dispatch(successUseLocal(stats));
        } else {
          dispatch(success(stats));
        }
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        setTimeout(() => {
          dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
      }
    );
  };

  function success(stats) {
    return { type: StatsConstants.FETCH_STATS_SUCCESS, stats };
  }
  function successUseLocal(stats) {
    return { type: StatsConstants.FETCH_STATS_SUCCESS_USE_LOCAL, stats };
  }
  function failure(error) {
    return { type: StatsConstants.FETCH_STATS_FAILURE, error };
  }
}

// Initialise a set of default stats values before stats are fetched from server.
function initStats(ticker, timestamp, price) {
  const stats = statsService.initStats(ticker, timestamp, price);
  return { type: StatsConstants.INIT_STATS, stats };
}

// Pose local "stats" data to server. Server will check if currIndex is newer before saving to database (anti-rollback).
function postStats(userid, ticker, stats) {
  const statsName = rtnStatsName(userid, ticker);

  return (dispatch) => {
    statsService.postStats(statsName, stats).then(
      (stats) => {
        dispatch(success(stats));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        // dispatch(userActions.logout());
        setTimeout(() => {
          dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
      }
    );
  };

  function success(stats) {
    return { type: StatsConstants.POST_STATS_SUCCESS, stats };
  }
  function failure(error) {
    return { type: StatsConstants.POST_STATS_FAILURE, error };
  }
}

// Update local copy of the "stats" object. This is used to allow program to run with async POST stats.
function updateStats(data) {
  return {
    type: StatsConstants.UPDATE_STATS_SUCCESS,
    payload: data,
  };
}
