import { ProgressConstants } from "../_constants";
import { progressService } from "../_services";
import { alertActions } from ".";
import config from "../_configs/configs.json";
import { ProgressItems } from "_types/stats";
import { Dispatch } from "redux";

export const progressActions = {
  fetchAllProgress,
};

// Get progress for all challenges from server. Server will return an empty array [] when no progress data is available.
function fetchAllProgress(userId: string) {
  return (dispatch: Dispatch) => {
    progressService.fetchAllProgress(userId).then(
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

  function success(progressItems: ProgressItems) {
    return {
      type: ProgressConstants.FETCH_ALL_PROGRESS_SUCCESS,
      progressItems,
    };
  }
  function failure(error: Error) {
    return { type: ProgressConstants.FETCH_ALL_PROGRESS_FAILURE, error };
  }
}
