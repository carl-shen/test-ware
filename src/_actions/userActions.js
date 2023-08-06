import { UserConstants } from "../_constants";
import { userService } from "../_services";
import { alertActions } from "./";
import { history } from "../_helpers";
import config from "../_configs/configs.json";

// Exposing the user actions functions together in one object.
export const userActions = {
  login,
  logout,
  register,
};

function login(username, password, from) {
  return (dispatch) => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      (user) => {
        dispatch(success(user));
        history.push(from);
        dispatch(alertActions.success("Login successful"));
        setTimeout(() => {
          dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        setTimeout(() => {
          dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
      }
    );
  };

  function request(user) {
    return { type: UserConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: UserConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: UserConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  userService.logout();
  return { type: UserConstants.LOGOUT };
}

function register(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.register(user).then(
      (user) => {
        dispatch(success());
        history.push("/login");
        dispatch(alertActions.success("Registration successful"));
        setTimeout(() => {
          dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        setTimeout(() => {
          dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
      }
    );
  };

  function request(user) {
    return { type: UserConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: UserConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: UserConstants.REGISTER_FAILURE, error };
  }
}

/* Unsupported user actions. */
// function getAll() {
//   return (dispatch) => {
//     dispatch(request());

//     userService.getAll().then(
//       (users) => dispatch(success(users)),
//       (error) => dispatch(failure(error.toString()))
//     );
//   };

//   function request() {
//     return { type: UserConstants.GETALL_REQUEST };
//   }
//   function success(users) {
//     return { type: UserConstants.GETALL_SUCCESS, users };
//   }
//   function failure(error) {
//     return { type: UserConstants.GETALL_FAILURE, error };
//   }
// }

// function _delete(id) {
//   return (dispatch) => {
//     dispatch(request(id));

//     userService.delete(id).then(
//       (user) => dispatch(success(id)),
//       (error) => dispatch(failure(id, error.toString()))
//     );
//   };

//   function request(id) {
//     return { type: UserConstants.DELETE_REQUEST, id };
//   }
//   function success(id) {
//     return { type: UserConstants.DELETE_SUCCESS, id };
//   }
//   function failure(id, error) {
//     return { type: UserConstants.DELETE_FAILURE, id, error };
//   }
// }
