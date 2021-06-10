import { parseData } from "../_data/withOHLCData";
import { tsvParse } from "d3-dsv";

export const rtnStatsName = function (userid, ticker) {
    return `${userid}-${ticker}`;
}

export const fetchData = function (dataSetName) {
    return fetch(
        `/data/${dataSetName}.tsv`,
        []
    ).then((response) => response.text())
    .then((data) => tsvParse(data, parseData()))
    .catch((error) => {
        console.log(error);
    });
};

export const roundToDefaultDecimal = function (value) {
    const decimalPlaces = 5;  // default round to 5 decimal places
    return Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
}

export const dateToYMDStr = function (date) {
    const mm = date.getMonth() + 1;  // getMonth starts from 0
    const dd = date.getDate();
    return `${date.getFullYear()}-${(mm>9? '':'0')}${mm}-${(dd>9? '':'0')}${dd}`;
};

export const challengeCompleted = function (stats, data) {
    if (stats !== undefined && data !== undefined) {
        return (stats.currIndex+1 >= data.length ? true : false);
        // return true;
    } else {
        return false;
    }
}

export const calcPerformance = function (stats) {
    if (stats !== undefined) {
        const durationDays = stats.currIndex - stats.stIndex;
        const duration = (durationDays/365.242);  // calculate a rough estimate of years
        const gain = stats.stPortValue!==0 ? (100 * (stats.totPortValue / stats.stPortValue - 1)).toFixed(2) + "%" : "invalid";
        const CAGR = (stats.stPortValue!==0 && duration>0) ? (100 * (Math.pow(stats.totPortValue / stats.stPortValue, 1 / duration) - 1)).toFixed(2) + "%" : "invalid";
        return {duration: duration.toFixed(2), gain: gain, CAGR: CAGR};
    } else {
        return {duration: "invalid", gain: "invalid", CAGR: "invalid"};
    }
}
