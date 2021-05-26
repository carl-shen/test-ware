import { statsConstants } from '../constants';

export function stats(state = {}, action) {
    switch (action.type) {
        case statsConstants.FETCH_STATS:
            return {
                items: action.payload
            }
        case statsConstants.INIT_STATS:
            return {
                items: action.payload
            }
        case statsConstants.POST_STATS:
            return {
                items: action.payload
            }
        case statsConstants.UPDATE_STATS:
            return {
                items: action.payload
            }
        default:
            return state;
    }
}