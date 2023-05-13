import "./trainer.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../_configs/configs.json";

import {
  history,
  fetchData,
  dateToYMDStr,
  roundToDefaultDecimal,
  challengeCompleted,
  calcNumOfBarsToDisplay,
  calcPerformance,
} from "../_helpers";
import { alertActions, statsActions } from "../_actions";
import {
  StockChart,
  Controls,
  Footer,
  useWindowDimensions,
  TopNavbar,
} from "../_components";

// TODO for user to be able to specify starting portfolio value
const DEFAULT_STARTING_PORTFOLIO_VALUE = 500000;
const DEFAULT_NUM_OF_BARS_TO_DISPLAY = 100;

function TrainerPage() {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const stats = useSelector((state) => state.stats.items);
  const user = useSelector((state) => state.authentication.user);

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const numOfBarsToDisplay = windowWidth
    ? calcNumOfBarsToDisplay(windowWidth)
    : DEFAULT_NUM_OF_BARS_TO_DISPLAY;
  const [chartHeight, setChartHeight] = useState(windowHeight * 0.7); // These default values will be re-calculated after components report their heights.
  const [chartWidth, setChartWidth] = useState(windowWidth - 100);
  const [dataSetName, setDataSetName] = useState("stock01");
  const [loadToIndex, setLoadToIndex] = useState(120);
  const [stepCounter, setStepCounter] = useState(0); // Specifies how often the "stats" object should be uploaded to the server.
  const [needToPostStats, setNeedToPostStats] = useState(false); // A flag used to mark whether "stats" object should be uploaded to the server.
  const [data, setData] = useState();

  // Adjust chart height when window resizes.
  useEffect(() => {
    if (
      app !== undefined &&
      app.ControlsHeight !== undefined &&
      app.FooterHeight !== undefined
    ) {
      setChartHeight(windowHeight - app.ControlsHeight - app.FooterHeight - 90);
    }
    if (app !== undefined && app.ControlsWidth !== undefined) {
      setChartWidth(app.ControlsWidth - 30);
    }
    // console.debug(`Height: ${windowHeight}, Width: ${windowWidth}`);
  }, [app, windowWidth, windowHeight]);

  // When the page is first loaded, initialise dataSetName, generate a dummy "stats" object, and fetch the asset's historical data.
  useEffect(() => {
    let tempDataSetName = dataSetName;
    if (app.trainingDataSet !== undefined) {
      tempDataSetName = app.trainingDataSet;
      setDataSetName(tempDataSetName);
    }

    dispatch(
      statsActions.initStats(tempDataSetName, DEFAULT_STARTING_PORTFOLIO_VALUE)
    );

    fetchData(tempDataSetName).then((response) => {
      setData(response);
    });
  }, [app.trainingDataSet, dataSetName, dispatch]);

  // When historical data is in place, initialise the "stats" object with stored timestamp and price data, then fetch existing stats from server (if there exists any).
  useEffect(() => {
    if (stats !== undefined && data !== undefined) {
      const newTimestamp = dateToYMDStr(data[loadToIndex]["date"]);
      const newPrice = data[loadToIndex]["close"];
      const dataLength = data.length;
      const tempStats = {
        ...stats,
        ts: newTimestamp,
        price: newPrice,
        endIndex: dataLength,
      };
      dispatch(statsActions.updateStats(tempStats)); // Update "stats" to correct initial timestamp and price values.
      dispatch(statsActions.fetchStats(user.id, dataSetName)); // Check and override local "stats" object if any existing "stats" object is available on server.
    }
  }, [data, dataSetName, dispatch, loadToIndex, user.id]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(alertActions.clear());
    }, config.ALERT_TIMEOUT);
  }, [dispatch]);

  // Whenever "stats" is changed (most likely by the Stepper component when user steps to next datapoint), update portfolio value and other details.
  useEffect(() => {
    if (
      stats !== undefined &&
      data !== undefined &&
      loadToIndex !== stats.currIndex &&
      !challengeCompleted(stats, data)
    ) {
      setStepCounter(stepCounter + 1);
      if (stepCounter % config.POST_STATS_EVERY_N_STEPS === 0) {
        setNeedToPostStats(true);
      }
      setLoadToIndex(stats.currIndex);
      const newTimestamp = dateToYMDStr(data[stats.currIndex]["date"]);
      const newPrice = data[stats.currIndex]["close"];
      // Total value and Profit/Loss stats need to be updated every bar change.
      const newTotalPortfolioValue =
        stats.fundsAvail + stats.posHeld * newPrice;
      const newPositionPL = (newPrice - stats.posCost) * stats.posHeld;

      const newPositionPLPercent =
        stats.posHeld !== 0 ? newPrice / stats.posCost - 1 : 0.0;
      const newGain =
        stats.totPortValue !== stats.stPortValue
          ? stats.totPortValue / stats.stPortValue - 1
          : 0.0;

      const tempStats = {
        ...stats,
        ts: newTimestamp,
        price: roundToDefaultDecimal(newPrice),
        totPortValue: roundToDefaultDecimal(newTotalPortfolioValue),
        posPL: roundToDefaultDecimal(newPositionPL),
        posPLPerc: roundToDefaultDecimal(newPositionPLPercent),
        progress: roundToDefaultDecimal(
          (stats.currIndex - stats.stIndex) / (stats.endIndex - stats.stIndex)
        ),
        gain: roundToDefaultDecimal(newGain),
      };
      dispatch(statsActions.updateStats(tempStats));
    }
    if (
      stats !== undefined &&
      data !== undefined &&
      user !== undefined &&
      needToPostStats
    ) {
      setNeedToPostStats(false);
      dispatch(statsActions.postStats(user.id, stats.ticker, stats));
    }
  }, [data, dispatch, loadToIndex, needToPostStats, stepCounter, user]);

  if (user === undefined) {
    // If user is logged out (e.g. by JWT expiration), redirect to the login page.
    setTimeout(() => {
      history.push("/login");
    }, 5000);
    return (
      <div className="col-lg-8 offset-lg-3 verticalUpper">
        <h3 className="text-white">You have been logged out.</h3>
        <h3 className="text-white">Please login again.</h3>
        <p className="text-white">
          You will be redirected to Login page in a few seconds..
        </p>
      </div>
    );
  } else {
    if (
      windowWidth < config.MIN_WINDOW_WIDTH ||
      windowHeight < config.MIN_WINDOW_HEIGHT
    ) {
      return (
        <>
          <TopNavbar />
          <div className="col-lg-8 offset-lg-3 verticalUpper">
            <h3 className="text-white">
              Please try using portrait mode, adjusting window size, or using a
              different device.
            </h3>
            <p className="text-white">
              Unforturnately, Test-Ware trainer is optimised for screens with a
              size larger than {config.MIN_WINDOW_WIDTH}px by{" "}
              {config.MIN_WINDOW_HEIGHT}px.
            </p>
            <p className="text-white">
              Your current screen size: {windowWidth}px by {windowHeight}px.
            </p>
          </div>
        </>
      );
    } else {
      if (windowWidth * windowHeight < config.minWindowArea) {
        return (
          <>
            <TopNavbar />
            <div className="col-lg-8 offset-lg-3 verticalUpper">
              <h3 className="text-white">
                Please try using portrait mode, adjusting window size, or using
                a different device.
              </h3>
              <p className="text-white">
                Unforturnately, Test-Ware trainer is optimised for screens with
                an area larger than {config.MIN_WINDOW_AREA}px^2.
              </p>
              <p className="text-white">
                Your current screen area: {windowWidth * windowHeight}px^2.
              </p>
            </div>
          </>
        );
      } else {
        if (challengeCompleted(stats, data)) {
          const { duration, gain, CAGR } = calcPerformance(stats);
          return (
            <>
              <TopNavbar />
              <div className="col-lg-8 offset-lg-3 verticalUpper widthWide">
                <h2 className="text-white">Congratulations!</h2>
                <br />
                <h3 className="text-white">
                  You've completed the challenge: {dataSetName}
                </h3>
                <br />
                <p className="text-white">
                  During the <b>{duration}</b> year period, you've made a gain
                  of <b>{gain}</b>.
                </p>
                <p className="text-white">
                  Annualised, that is a CAGR of <b>{CAGR}</b>.
                </p>
              </div>
            </>
          );
        } else {
          if (data !== undefined) {
            return (
              <div>
                <TopNavbar />
                <div id="chart-div">
                  <StockChart
                    height={chartHeight}
                    width={chartWidth}
                    data={data.slice(0, stats.currIndex + 1)}
                    numOfBarsToDisplay={numOfBarsToDisplay}
                  />
                </div>
                {/* <h2 style={{color:'red', position: 'fixed', zIndex: 100, left: '30px', top: '10px'}}>Demo only, app currently under construction.</h2> */}
                <Controls />
                <Footer />
              </div>
            );
          } else {
            return (
              <div>
                <h3 className="text-white">Loading data for {dataSetName}..</h3>
              </div>
            );
          }
        }
      }
    }
  }
}

export { TrainerPage };
