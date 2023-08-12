import { buildAuthHeader } from "_helpers";
import config from "_configs/configs.json";

export const progressService = {
  fetchAllProgress,
};

function fetchAllProgress(userId: string) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: buildAuthHeader(),
  };

  return fetch(
    `${config.apiUrl}/users/rtnAllProgress.php?userId=${userId}`,
    requestOptions
  )
    .then(handleResponse)
    .then((progressItems) => {
      return progressItems;
    });
}

function handleResponse(response: Response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
