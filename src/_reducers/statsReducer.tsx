import { statsConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function stats(state: AppState = {}, action: AnyAction): AppState {
  switch (action.type) {
    case statsConstants.FETCH_STATS_SUCCESS:
      return {
        items: action.stats,
      };
    case statsConstants.FETCH_STATS_SUCCESS_USE_LOCAL:
      return state;
    case statsConstants.FETCH_STATS_FAILURE:
      return state;
    case statsConstants.INIT_STATS:
      return {
        items: action.stats,
      };
    case statsConstants.POST_STATS_SUCCESS:
      return state;
    case statsConstants.POST_STATS_FAILURE:
      return state;
    case statsConstants.UPDATE_STATS_SUCCESS:
      return {
        items: action.payload,
      };
    case statsConstants.UPDATE_STATS_FAILURE:
      return {};
    default:
      return state;
  }
}
