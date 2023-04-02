import { authHeader } from "../_helpers";
import config from "../_configs/configs.json";

export const progressService = {
  fetchAllProgress,
};

function fetchAllProgress(userid) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(
    `${config.apiUrl}/users/rtnAllProgress.php?userID=${userid}`,
    requestOptions
  )
    .then(handleResponse)
    .then((progressItems) => {
      return progressItems;
    });
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
