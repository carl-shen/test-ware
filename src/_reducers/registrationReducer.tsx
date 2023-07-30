import { userConstants } from "_constants";
import { AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function registration(
  state: AppState = {},
  action: AnyAction
): AppState {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      return {};
    case userConstants.REGISTER_FAILURE:
      return {};
    default:
      return state;
  }
}
