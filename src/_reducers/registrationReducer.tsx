import { UserConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function registration(
  state: AppState = {},
  action: AnyAction
): AppState {
  switch (action.type) {
    case UserConstants.REGISTER_REQUEST:
      return { registering: true };
    case UserConstants.REGISTER_SUCCESS:
      return {};
    case UserConstants.REGISTER_FAILURE:
      return {};
    default:
      return state;
  }
}
