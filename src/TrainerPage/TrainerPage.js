import './trainer.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../_configs/configs.json';

import { history, fetchData, dateToYMDStr, roundToDefaultDecimal, challengeCompleted, calcPerformance } from '../_helpers';
import { alertActions, statsActions } from '../_actions';
import { StockChart, Controls, Footer, useWindowDimensions, TopNavbar } from '../_components';

function TrainerPage() {
    const dispatch = useDispatch();
    const app = useSelector(state => state.app);
    const stats = useSelector(state => state.stats.items);
    const user = useSelector(state => state.authentication.user);
    const alert = useSelector(state => state.alert);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const [ chartHeight, setChartHeight ] = useState(windowHeight * 0.7);
    const [ dataSetName, setDataSetName ] = useState("stock01");
    const [ loadToIndex, setLoadToIndex ] = useState(120);
    const [ stepCounter, setStepCounter ] = useState(0);  // allow for stats post actions every n steps
    const [ needToPostStats, setNeedToPostStats ] = useState(false);  // a flag to make sure no duplicate posts
    const [ data, setData ] = useState();

    // adjust chart height when window resizes
    useEffect(() => {
        if (app !== undefined && app.ControlsHeight !== undefined && app.FooterHeight !== undefined) {
            setChartHeight(windowHeight - app.ControlsHeight - app.FooterHeight - 90);
        }
    }, [app, windowWidth, windowHeight]);

    // when page is first loaded, dataSetName is first initialised and we initialise dummy stats and fetch asset historical data
    useEffect(() => {
        let tempDataSetName = dataSetName;
        // if app.trainingDataSet is specified correctly, use accordingly, otherwise default dataSetName will be in effect
        if (app.trainingDataSet !== undefined) {
            tempDataSetName = app.trainingDataSet;
            setDataSetName(tempDataSetName);
        }
        if (stats === undefined) {
            dispatch(statsActions.initStats(tempDataSetName, "2000-01-01", 10.0));  // initialise to dummy values for components to load
        }
        fetchData(tempDataSetName).then((response) => { setData(response); });
    }, [dataSetName]); 

    // when historical data is in place, initialise stats with correct timestamp and price data, then fetch existing stats from server (if there exists any)
    useEffect(() => {
        if (stats !== undefined && data !== undefined) {
            const newTimestamp = dateToYMDStr(data[loadToIndex]['date']);
            const newPrice = data[loadToIndex]['close'];
            const tempStats = {
                ...stats,
                timestamp: newTimestamp,
                price: newPrice
            }
            dispatch(statsActions.updateStats(tempStats));  // update stats to correct initial timestamp and price values
            dispatch(statsActions.fetchStats(user.id, dataSetName));  // check if existing stats available on server and override local stats if so    
        }
    }, [data]);

    useEffect(() => {
        setTimeout(() => {
            dispatch(alertActions.clear());
        }, config.ALERT_TIMEOUT);
    }, []);

    // whenever stats gets changed (most likely by Stepper when user steps to next datapoint), update portfolio details etc. 
    useEffect(() => {
        // when stats.currIndex change, update price, portfolio details, and chart data
        if (stats !== undefined && data !== undefined && loadToIndex != stats.currIndex) {
            setStepCounter(stepCounter + 1);
            if (stepCounter % config.POST_STATS_EVERY_N_STEPS === 0) {
                setNeedToPostStats(true);  // flag for postStats
            }
            setLoadToIndex(stats.currIndex);
            const newTimestamp = dateToYMDStr(data[stats.currIndex]['date']);
            const newPrice = data[stats.currIndex]['close'];
            // Total value and Profit/Loss stats need to be updated every bar change
            const newTotalPortfolioValue = stats.fundsAvailable + stats.positionHeld * newPrice;
            const newPositionPL = (newPrice - stats.positionCost) * stats.positionHeld;
            let newPositionPLPercent = 0;  // dafault value to handle div by 0 case
            if (stats.positionHeld != 0) {  // above code should not be placed inside this IF, to handle the case where all asset is sold and positionHeld just becomes 0
                newPositionPLPercent = newPrice / stats.positionCost - 1;
            }

            const tempStats = {
                ...stats,
                timestamp: newTimestamp,
                price: roundToDefaultDecimal(newPrice),
                totalPortfolioValue: roundToDefaultDecimal(newTotalPortfolioValue),
                positionPL: roundToDefaultDecimal(newPositionPL),
                positionPLPercent : roundToDefaultDecimal(newPositionPLPercent)
            };
            dispatch(statsActions.updateStats(tempStats));
        }
        if (stats !== undefined && data !== undefined && user !== undefined && needToPostStats) {
            setNeedToPostStats(false);  // clear flag for postStats
            dispatch(statsActions.postStats(user.id, stats.ticker, stats));
        }
    }, [stats]);

    if (user === undefined) {  // if user is logged out (e.g. by JWT expiration), redirect to login page
        setTimeout(() => { 
            history.push('/login');
        }, 5000)
        return (
            <div className="col-lg-8 offset-lg-3 verticalUpper">
                <h3 className="text-white">You have been logged out.</h3>
                <h3 className="text-white">Please login again.</h3>
                <p className="text-white">You will be redirected to Login page in a few seconds..</p>
            </div>
        );
    } else {
        if (windowWidth < config.minWindowWidth || windowHeight < config.minWindowHeight) {
            return (
                <div className="col-lg-8 offset-lg-3 verticalUpper">
                    <h3 className="text-white">Please try using a different device or adjust window size.</h3>
                    <p className="text-white">Unforturnately, Test-Ware trainer is optimised for screens wider than {config.minWindowWidth}px and taller than {config.minWindowHeight}px.</p>
                </div>
            );
        } else { 
            if (challengeCompleted(stats, data)) {
                const { duration, gain, CAGR } = calcPerformance(stats);
                return (
                    <div className="col-lg-8 offset-lg-3 verticalUpper widthWide">
                        <h2 className="text-white">Congratulations!</h2>
                        <br />
                        <h3 className="text-white">You've completed the challenge: {dataSetName}</h3>
                        <br />
                        <p className="text-white">During the <b>{duration}</b> year period, you've made a gain of <b>{gain}</b>.</p>
                        <p className="text-white">Annualised, that is a CAGR of <b>{CAGR}</b>.</p>
                    </div>
                );
            } else {
                if (data != undefined) {
                    return (
                        <div>
                            <TopNavbar />
                            <div id="chart-div">
                                <StockChart height={chartHeight} width={windowWidth - 100} data={data.slice(0, stats.currIndex+1)}/>
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

export { TrainerPage };