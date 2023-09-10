import { AlertConstants } from "_constants";

export const alertActions = {
  success,
  error,
  clear,
};

function success(message: string) {
  return { type: AlertConstants.SUCCESS, message };
}

function error(message: string) {
  return { type: AlertConstants.ERROR, message };
}

function clear() {
  return { type: AlertConstants.CLEAR };
}
