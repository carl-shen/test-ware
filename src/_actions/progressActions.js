import { progressConstants } from "../_constants";
import { progressService } from "../_services";
import { alertActions } from "./";
import config from "../_configs/configs.json";

export const progressActions = {
  fetchAllProgress,
};

// Get progress for all challenges from server. Server will return an empty array [] when no progress data is available.
function fetchAllProgress(userid) {
  return (dispatch) => {
    progressService.fetchAllProgress(userid).then(
      (progressItems) => {
        dispatch(success(progressItems));
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

  function success(progressItems) {
    return {
      type: progressConstants.FETCH_ALL_PROGRESS_SUCCESS,
      progressItems,
    };
  }
  function failure(error) {
    return { type: progressConstants.FETCH_ALL_PROGRESS_FAILURE, error };
  }
}
