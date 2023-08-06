import { StatsConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function stats(state: AppState = {}, action: AnyAction): AppState {
  switch (action.type) {
    case StatsConstants.FETCH_STATS_SUCCESS:
      return {
        items: action.stats,
      };
    case StatsConstants.FETCH_STATS_SUCCESS_USE_LOCAL:
      return state;
    case StatsConstants.FETCH_STATS_FAILURE:
      return state;
    case StatsConstants.INIT_STATS:
      return {
        items: action.stats,
      };
    case StatsConstants.POST_STATS_SUCCESS:
      return state;
    case StatsConstants.POST_STATS_FAILURE:
      return state;
    case StatsConstants.UPDATE_STATS_SUCCESS:
      return {
        items: action.payload,
      };
    case StatsConstants.UPDATE_STATS_FAILURE:
      return {};
    default:
      return state;
  }
}
