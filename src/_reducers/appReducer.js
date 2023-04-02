import { appConstants } from "../_constants";

export function app(state = {}, action) {
  switch (action.type) {
    case appConstants.UPDATE_COMPONENT_SIZE:
      return {
        ...state,
        [action.payload.componentSizeName]: action.payload.size,
      };
    case appConstants.SET_TRAINING_DATA_SET:
      return {
        trainingDataSet: action.payload,
      };
    default:
      return state;
  }
}
