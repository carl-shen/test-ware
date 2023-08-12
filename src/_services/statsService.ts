import { buildAuthHeader } from "_helpers";
import { statsDummy } from "_constants";
import config from "_configs/configs.json";
import { Stats } from "_types/stats";

export const statsService = {
  fetchStats,
  initStats,
  postStats,
};

function fetchStats(statsName: string) {
  const requestOptions = {
    method: "GET",
    headers: buildAuthHeader(),
  };

  return fetch(
    `${config.apiUrl}/users/rtnStats.php?statsName=${statsName}`,
    requestOptions
  )
    .then(handleResponse)
    .then((stats) => {
      return stats;
    });
}

// Initialise stats with dummy values. Note the variable names are kept short to save database and web traffic load when dealing with JSON encoded strings.
function initStats(ticker: string, startingPortfolioValue: number) {
  return {
    ...statsDummy,
    ticker: ticker,
    totPortValue: startingPortfolioValue,
    fundsAvail: startingPortfolioValue,
    stPortValue: startingPortfolioValue,
  };
}

function postStats(statsName: string, stats: Stats) {
  const requestOptions = {
    method: "PUT",
    headers: { ...buildAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ statsName, stats }),
  };
  return fetch(`${config.apiUrl}/users/storeStats.php`, requestOptions).then(
    handleResponse
  );
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
