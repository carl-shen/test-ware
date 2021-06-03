import { appConstants } from '../_constants';

export function app(state ={}, action) {
    switch (action.type) {
        case appConstants.UPDATE_COMPONENT_HEIGHT:
            return {
                ...state,
                [action.payload.componentHeightName]: action.payload.height
            };
        case appConstants.SET_TRAINING_DATA_SET:
            return {
                trainingDataSet: action.payload
            }
        default:
            return state;
    }
};