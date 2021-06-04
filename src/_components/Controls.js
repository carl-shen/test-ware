
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appActions } from '../_actions';
import { Trader, Stepper } from './';


function Controls() {
    const targetRef = useRef();
    const dispatch = useDispatch();
    const app = useSelector(state => state.app);
    const stats = useSelector(state => state.stats.items);    


    // dispatch component' own height when the height changes
    if (targetRef.current) {
        const height = targetRef.current.offsetHeight;
        if (app !== undefined) {
            if (app.ControlsHeight !== height) {
                dispatch(appActions.updateComponentHeight("ControlsHeight", height));
            }
        }
    }

    return (
        <div id="controls" ref={targetRef}>
            <div id="controls-left">
                <div id="controls-left-bottom">
                    <div className="hint-div">
                        <small>This area displays action status and recent trades:</small>
                    </div>
                    <div><p className="labels">{stats.statusText}</p></div>
                    <div><p className="labels">{stats.recentTrade1}</p></div>
                    <div><p className="labels">{stats.recentTrade2}</p></div>
                    <div><p className="labels">{stats.recentTrade3}</p></div>
                    <div><p className="labels">{stats.recentTrade4}</p></div>
                    <div><p className="labels">{stats.recentTrade5}</p></div>
                </div>
            </div>
            <div id="controls-right">
                <div id="controls-right-top">
                    <div className="hint-div">
                        <small>Details of your simulated portfolio:</small>
                    </div>
                    <div id="controls-portfolio-details">
                        <div><p className="labels">Total Portfolio Value: </p><span className="labels">{stats.totalPortfolioValue.toFixed(1)}</span></div>
                        <div><p className="labels">Funds Available: </p><span className="labels">{stats.fundsAvailable.toFixed(1)}</span></div>
                        <div><p className="labels">Position Held: </p><span className="labels">{stats.positionHeld}</span></div>
                        <div><p className="labels">Position Cost Base: </p><span className="labels">{stats.positionCost.toFixed(2)}</span></div>
                        <div><p className="labels">Position Profit/Loss: </p><span className="labels">{stats.positionPL.toFixed(1)}</span></div>
                        <div><p className="labels">Position P/L Percentage: </p><span className="labels">{stats.positionPLPercent.toFixed(2) + "%"}</span></div>
                    </div>
                </div>
                <div id="controls-right-bottom">
                    <div id="controls-right-bottom-left">
                        <div className="hint-div">
                            <small>The time in history and the closing price:</small>
                        </div>
                        <div><p className="labels" id="output-timestamp">{stats.timestamp}</p></div>
                        <div><p className="labels" id="output-price">{stats.price.toFixed(2)}</p></div>
                    </div>
                    <div id="controls-right-bottom-middle">
                        <div className="hint-div">
                            <small >Trade at the closing price using these controls:</small>
                        </div>
                        <div id="controls-trade-div">
                            <Trader />
                        </div>
                    </div>
                    <div id="controls-right-bottom-right">
                        <div className="hint-div">
                            <small>Use these buttons to move to the next day(s):</small>
                        </div>
                        <div>
                            <Stepper />
                        </div>
                    </div>
                </div>
            </div>
            <br style={{clear: "left"}} />
        </div>
    );
}


export { Controls };