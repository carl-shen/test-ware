import { userConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function authentication(
  state: AppState = {},
  action: AnyAction
): AppState {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
