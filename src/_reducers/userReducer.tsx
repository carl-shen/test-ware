import { UserConstants } from "_constants";
import { AppState, User } from "_types/reducer";
import { AnyAction } from "redux";

export function users(state: AppState = {}, action: AnyAction): AppState {
  switch (action.type) {
    case UserConstants.GETALL_REQUEST:
      return {
        loading: true,
      };
    case UserConstants.GETALL_SUCCESS:
      return {
        items: action.users,
      };
    case UserConstants.GETALL_FAILURE:
      return {
        error: action.error,
      };

    case UserConstants.DELETE_REQUEST:
      // Add "deteting: true" for users being deleted.
      return {
        ...state,
        items: state.items.map((user: User) =>
          user.id === action.id ? { ...user, deleting: true } : user
        ),
      };
    case UserConstants.DELETE_SUCCESS:
      // Remove deleted user from state.
      return {
        items: state.items.filter((user: User) => user.id !== action.id),
      };
    case UserConstants.DELETE_FAILURE:
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
