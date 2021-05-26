import { statsConstants } from '../constants';

const initialState = {
    items: [],
    item: {}
};


// export default function(state = initialState, action) {
export function stats(state = initialState, action) {
    switch (action.type) {
        case statsConstants.FETCH_STATS:
            return {
                ...state,
                items: action.payload
            }
        case statsConstants.INIT_STATS:
            return {
                ...state,
                items: action.payload
            }
        case statsConstants.POST_STATS:
            return {
                ...state,
                items: action.payload
            }
        case statsConstants.UPDATE_STATS:
            return {
                ...state,
                items: action.payload
            }
        default:
            return state;
    }
}