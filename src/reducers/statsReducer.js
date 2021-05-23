import { FETCH_STATS, INIT_STATS, POST_STATS, UPDATE_STATS } from '../actions/types';

const initialState = {
    items: [],
    item: {}
};


export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_STATS:
            return {
                ...state,
                items: action.payload
            }
        case INIT_STATS:
            return {
                ...state,
                items: action.payload
            }
        case POST_STATS:
            return {
                ...state,
                items: action.payload
            }
        case UPDATE_STATS:
            return {
                ...state,
                items: action.payload
            }
        default:
            return state;
    }
}