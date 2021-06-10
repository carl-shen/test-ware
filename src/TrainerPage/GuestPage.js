import './trainer.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../_configs/configs.json';

import { history, fetchData, dateToYMDStr, roundToDefaultDecimal, challengeCompleted, calcPerformance } from '../_helpers';
import { alertActions, statsActions } from '../_actions';
import { StockChart, Controls, Footer, useWindowDimensions, TopNavbar } from '../_components';

function GuestPage() {
    const dispatch = useDispatch();
    const app = useSelector(state => state.app);
    const stats = useSelector(state => state.stats.items);
    const alert = useSelector(state => state.alert);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const [ chartHeight, setChartHeight ] = useState(windowHeight * 0.7);  // these default values will be re-calculated after components report their heights
    const [ chartWidth, setChartWidth ] = useState(windowWidth - 100);
    const [ dataSetName, setDataSetName ] = useState("stock01");
    const [ loadToIndex, setLoadToIndex ] = useState(120);
    const [ data, setData ] = useState();

    // adjust chart height when window resizes
    useEffect(() => {
        if (app !== undefined && app.ControlsHeight !== undefined && app.FooterHeight !== undefined) {
            setChartHeight(windowHeight - app.ControlsHeight - app.FooterHeight - 90);
        }
        if (app !== undefined && app.ControlsWidth !== undefined) {
            setChartWidth(app.ControlsWidth - 30);
        }
        // console.log(`Height: ${windowHeight}, Width: ${windowWidth}`);
    }, [app, windowWidth, windowHeight]);

    // when page is first loaded, dataSetName is first initialised and we initialise dummy stats and fetch asset historical data
    useEffect(() => {
        let tempDataSetName = dataSetName;
        // if app.trainingDataSet is specified correctly, use accordingly, otherwise default dataSetName will be in effect
        if (app.trainingDataSet !== undefined) {
            tempDataSetName = app.trainingDataSet;
            setDataSetName(tempDataSetName);
        }

        dispatch(statsActions.initStats(tempDataSetName, 500000));  // TODO for user to be able to specify starting portfolio value
        fetchData(dataSetName).then((response) => { setData(response); });
    }, [dataSetName]); 

    // when historical data is in place, initialise stats with correct timestamp and price data, then fetch existing stats from server (if there exists any)
    useEffect(() => {
        if (stats !== undefined && data !== undefined) {
            const newTimestamp = dateToYMDStr(data[loadToIndex]['date']);
            const newPrice = data[loadToIndex]['close'];
            const dataLength = data.length;
            const tempStats = {
                ...stats,
                ts: newTimestamp,
                price: newPrice,
                endIndex: dataLength
            }
            dispatch(statsActions.updateStats(tempStats));  // update stats to correct initial timestamp and price values
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
        if (stats !== undefined && data !== undefined && loadToIndex != stats.currIndex && !challengeCompleted(stats, data)) {
            setLoadToIndex(stats.currIndex);
            const newTimestamp = dateToYMDStr(data[stats.currIndex]['date']);
            const newPrice = data[stats.currIndex]['close'];
            // Total value and Profit/Loss stats need to be updated every bar change
            const newTotalPortfolioValue = stats.fundsAvailable + stats.positionHeld * newPrice;
            const newPositionPL = (newPrice - stats.positionCost) * stats.positionHeld;
            const newPositionPLPercent = stats.posHeld !== 0 ? newPrice / stats.posCost - 1 : 0.0;
            const newGain = stats.totPortValue !== stats.stPortValue ? (stats.totPortValue / stats.stPortValue) - 1 : 0.0;

            const tempStats = {
                ...stats,
                ts: newTimestamp,
                price: roundToDefaultDecimal(newPrice),
                totPortValue: roundToDefaultDecimal(newTotalPortfolioValue),
                posPL: roundToDefaultDecimal(newPositionPL),
                posPLPerc: roundToDefaultDecimal(newPositionPLPercent),
                progress: roundToDefaultDecimal((stats.currIndex - stats.stIndex)/(stats.endIndex - stats.stIndex)),
                gain: roundToDefaultDecimal(newGain)
            };
            dispatch(statsActions.updateStats(tempStats));
        }
    }, [stats]);
    
    if (windowWidth < config.MIN_WINDOW_WIDTH || windowHeight < config.MIN_WINDOW_HEIGHT) {
        return (
            <>
                <TopNavbar />
                <div className="col-lg-8 offset-lg-3 verticalUpper">
                    <h3 className="text-white">Please try using portrait mode, adjusting window size, or using a different device.</h3>
                    <p className="text-white">Unforturnately, Test-Ware trainer is optimised for screens with a size larger than {config.MIN_WINDOW_WIDTH}px by {config.MIN_WINDOW_HEIGHT}px.</p>
                    <p className="text-white">Your current screen size: {windowWidth}px by {windowHeight}px.</p>
                </div>
            </>
        );
    } else {
        if (windowWidth * windowHeight < config.minWindowArea) {
            return (
                <>
                    <TopNavbar />
                    <div className="col-lg-8 offset-lg-3 verticalUpper">
                        <h3 className="text-white">Please try using portrait mode, adjusting window size, or using a different device.</h3>
                        <p className="text-white">Unforturnately, Test-Ware trainer is optimised for screens with an area larger than {config.MIN_WINDOW_AREA}px^2.</p>
                        <p className="text-white">Your current screen area: {windowWidth * windowHeight}px^2.</p>
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
                            <h3 className="text-white">You've completed the challenge: {dataSetName}</h3>
                            <br />
                            <p className="text-white">During the <b>{duration}</b> year period, you've made a gain of <b>{gain}</b>.</p>
                            <p className="text-white">Annualised, that is a CAGR of <b>{CAGR}</b>.</p>
                        </div>
                    </>
                );
            } else {
                if (data != undefined) {
                    return (
                        <div>
                            <TopNavbar />
                            <div id="chart-div">
                                <StockChart height={chartHeight} width={chartWidth} data={data.slice(0, stats.currIndex+1)}/>
                            </div>
                            <h2 id="guest-demo-h">Guest demo, your progress is not saved.</h2>
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

export { GuestPage };