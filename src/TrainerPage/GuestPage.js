
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
    const [ chartHeight, setChartHeight ] = useState(windowHeight * 0.7);
    const [ dataSetName, setDataSetName ] = useState("stock01");
    const [ loadToIndex, setLoadToIndex ] = useState(120);
    const [ data, setData ] = useState();

    useEffect(() => {
        if (app !== undefined) {
            setChartHeight(windowHeight - app.ControlsHeight - app.FooterHeight - 100);
        }
    }, [app, windowWidth, windowHeight]);

    // when page is first loaded, dataSetName is first initialised and we initialise dummy stats and fetch asset historical data
    useEffect(() => {
        if (stats === undefined) {
            dispatch(statsActions.initStats(dataSetName, "2000-01-01", 10.0));  // initialise to dummy values for components to load
        }
        fetchData(dataSetName).then((response) => { setData(response); });
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
                price: newPrice,
                totalPortfolioValue: newTotalPortfolioValue,
                positionPL: newPositionPL,
                positionPLPercent : newPositionPLPercent
            };
            dispatch(statsActions.updateStats(tempStats));
        }

    }, [stats]);


    
    if (windowWidth < config.minWindowWidth || windowHeight < config.minWindowWidth) {
        return (
            <div className="col-lg-8 offset-lg-3 verticalUpper">
                <h3 className="text-white">Please try using a different device or screen size.</h3>
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
                        <h2 style={{color:'red', position: 'fixed', zIndex: 100, left: '120px', top: '0px'}}>Guest demo, your progress is not saved.</h2>
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

export { GuestPage };