import { PriceData } from "_types/stockData";
import { parseData } from "_data/withOHLCData";
import { tsvParse } from "d3-dsv";
import { PortfolioPerformance, Stats } from "_types/stats";

const DEFAULT_DECIMAL_PLACES = 5;

export const rtnStatsName = function (userId: string, ticker: string): string {
  return `${userId}-${ticker}`;
};

export const fetchData = function (dataSetName: string) {
  return fetch(`/data/${dataSetName}.tsv`)
    .then((response) => response.text())
    .then((data) => tsvParse(data, parseData()))
    .catch((error) => {
      console.log(error);
    });
};

/**
 * Round a number to the default number of decimal places, by converting a number
 * to exponential notaion, rounding it, and converting the result back to decimal
 * notation.
 *
 * @param value
 * @returns
 */
export const roundToDefaultDecimal = function (value: number) {
  return Number(
    Math.round(parseFloat(value + "e" + DEFAULT_DECIMAL_PLACES)) +
      "e-" +
      DEFAULT_DECIMAL_PLACES
  );
};

export const dateToYMDStr = function (date: Date): String {
  const mm = date.getMonth() + 1; // Note that return value of getMonth() starts from 0.
  const dd = date.getDate();
  return `${date.getFullYear()}-${mm > 9 ? "" : "0"}${mm}-${
    dd > 9 ? "" : "0"
  }${dd}`;
};

/**
 * Compare progress in stats against the length of underlying price data
 * to calculate whether a challenge has been completed.
 *
 * @param stats
 * @param data
 * @returns
 */
export const challengeCompleted = function (
  stats: Stats,
  data: PriceData
): boolean {
  if (stats !== undefined && data !== undefined) {
    return stats.currIndex + 1 >= data.length ? true : false;
  } else {
    return false;
  }
};

/**
 * Calculate the number of candle bars to display based on window width.
 *
 * @param windowWidth
 * @returns
 */
export const calcNumOfBarsToDisplay = function (windowWidth: number): number {
  const numOfBarsToDisplay = Math.ceil(windowWidth / 10);
  return numOfBarsToDisplay;
};

export const calcPerformance = function (stats: Stats): PortfolioPerformance {
  if (stats !== undefined) {
    const durationDays = stats.currIndex - stats.stIndex;
    const duration = durationDays / 365.242; // Calculate a rough estimate of years.
    const gain =
      stats.stPortValue !== 0
        ? (100 * (stats.totPortValue / stats.stPortValue - 1)).toFixed(2) + "%"
        : "invalid";
    const CAGR =
      stats.stPortValue !== 0 && duration > 0
        ? (
            100 *
            (Math.pow(stats.totPortValue / stats.stPortValue, 1 / duration) - 1)
          ).toFixed(2) + "%"
        : "invalid";
    return { duration: duration.toFixed(2), gain: gain, CAGR: CAGR };
  } else {
    return { duration: "invalid", gain: "invalid", CAGR: "invalid" };
  }
};
