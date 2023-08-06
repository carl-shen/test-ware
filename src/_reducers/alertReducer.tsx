import { AlertConstants } from "_constants";
import { AlertMessage, AppState } from "_types/reducer";
import { AnyAction } from "redux";

export function alert(
  state: AppState = {},
  action: AnyAction
): AlertMessage | AppState {
  switch (action.type) {
    case AlertConstants.SUCCESS:
      return {
        type: "alert-success",
        message: action.message,
      };
    case AlertConstants.ERROR:
      return {
        type: "alert-danger",
        message: action.message,
      };
    case AlertConstants.CLEAR:
      return {};
    default:
      return state;
  }
}
