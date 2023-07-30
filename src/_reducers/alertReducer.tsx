import { alertConstants } from "_constants";
import { AlertMessage, AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function alert(
  state: AppState = {},
  action: AnyAction
): AlertMessage | AppState {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: "alert-success",
        message: action.message,
      };
    case alertConstants.ERROR:
      return {
        type: "alert-danger",
        message: action.message,
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state;
  }
}
