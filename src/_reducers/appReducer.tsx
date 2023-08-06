import { AppConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function app(state: AppState = {}, action: AnyAction): AppState {
  switch (action.type) {
    case AppConstants.UPDATE_COMPONENT_SIZE:
      return {
        ...state,
        [action.payload.componentSizeName]: action.payload.size,
      };
    case AppConstants.SET_TRAINING_DATA_SET:
      return {
        trainingDataSet: action.payload,
      };
    default:
      return state;
  }
}
