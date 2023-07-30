import { userConstants } from "_constants";
import { AppState, User } from "_types/reducer";
import { AnyAction } from "redux";

export function users(state: AppState = {}, action: AnyAction): AppState {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true,
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users,
      };
    case userConstants.GETALL_FAILURE:
      return {
        error: action.error,
      };

    case userConstants.DELETE_REQUEST:
      // Add "deteting: true" for users being deleted.
      return {
        ...state,
        items: state.items.map((user: User) =>
          user.id === action.id ? { ...user, deleting: true } : user
        ),
      };
    case userConstants.DELETE_SUCCESS:
      // Remove deleted user from state.
      return {
        items: state.items.filter((user: User) => user.id !== action.id),
      };
    case userConstants.DELETE_FAILURE:
      return {
        ...state,
        items: state.items.map((user: User) => {
          if (user.id === action.id) {
            // Make a copy of user without the "deleting" key.
            const { deleting, ...userCopy } = user;
            // Return a copy of user with "deleteError:[error]" property.
            return { ...userCopy, deleteError: action.error };
          }
          return user;
        }),
      };

    default:
      return state;
  }
}
