import { progressConstants } from '../_constants';

export function progress(state = {}, action) {
    switch (action.type) {
        case progressConstants.FETCH_ALL_PROGRESS_SUCCESS:
            return {
                items: action.progressItems
            };
        case progressConstants.FETCH_ALL_PROGRESS_FAILURE:
            return {};
        default:
            return state;
    }
}
