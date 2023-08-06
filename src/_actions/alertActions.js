import { AlertConstants } from "_constants";

export const alertActions = {
  success,
  error,
  clear,
};

function success(message) {
  return { type: AlertConstants.SUCCESS, message };
}

function error(message) {
  return { type: AlertConstants.ERROR, message };
}

function clear() {
  return { type: AlertConstants.CLEAR };
}
