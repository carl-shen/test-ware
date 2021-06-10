import { progressConstants } from '../_constants';
import { progressService } from '../_services';
import { alertActions } from './';
import config from '../_configs/configs.json';

export const progressActions = {
    fetchAllProgress
};

// GET all challenge progress from server, if none existed the server will return an empty array []
function fetchAllProgress(userid) {
    // console.log('fetching all progress..');

    return dispatch => {
        progressService.fetchAllProgress(userid)
            .then(
                progressItems => {
                    // progressItems = JSON.parse(progressItems);
                    // console.log(progressItems);
                    dispatch(success(progressItems)); 
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

    function success(progressItems) { return { type: progressConstants.FETCH_ALL_PROGRESS_SUCCESS, progressItems } }
    function failure(error) { return { type: progressConstants.FETCH_ALL_PROGRESS_FAILURE, error } }
}