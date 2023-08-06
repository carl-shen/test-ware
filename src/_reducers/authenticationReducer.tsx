import { UserConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function authentication(
  state: AppState = {},
  action: AnyAction
): AppState {
  switch (action.type) {
    case UserConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      };
    case UserConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case UserConstants.LOGIN_FAILURE:
      return {};
    case UserConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
