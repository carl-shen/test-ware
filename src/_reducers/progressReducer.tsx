import { ProgressConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function progress(state: AppState = {}, action: AnyAction): AppState {
  switch (action.type) {
    case ProgressConstants.FETCH_ALL_PROGRESS_SUCCESS:
      return {
        items: action.progressItems,
      };
    case ProgressConstants.FETCH_ALL_PROGRESS_FAILURE:
      return {};
    default:
      return state;
  }
}
