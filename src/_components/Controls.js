
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appActions } from '../_actions';
import { Trader, Stepper, getWindowDimensions, usePortraitMode } from './';


function Controls() {
    const targetRef = useRef();
    const dispatch = useDispatch();
    const app = useSelector(state => state.app);
    const stats = useSelector(state => state.stats.items);    

    const windowWidth = getWindowDimensions().width;
    const windowHeight = getWindowDimensions().height;

    useEffect(() => {
        // dispatch component' own height when the height changes
        if (targetRef.current) {
            const height = targetRef.current.offsetHeight;
            const width = targetRef.current.offsetWidth;
            if (app !== undefined) {
                if (app.ControlsHeight !== height) {
                    dispatch(appActions.updateComponentSize("ControlsHeight", height));
                }
                if (app.ControlsWidth !== width) {
                    dispatch(appActions.updateComponentSize("ControlsWidth", width));
                }
            }
        }
    }, [windowWidth, windowHeight])

    // different layouts of trades info panel for landscape and portrait mode
    const trades_info_div_left = 
        <div id="controls-left">
            <div id="controls-trades-info-inner">
                {!usePortraitMode() ? 
                    <div className="hint-div">
                        <small>This area displays action status and recent trades:</small>
                    </div>
                : <></>}
                <div className="labels-div"><p className="labels">{stats.status}</p></div>
                <div className="labels-div"><p className="labels">{stats.rctTrade1}</p></div>
                <div className="labels-div"><p className="labels">{stats.rctTrade2}</p></div>
                <div className="labels-div"><p className="labels">{stats.rctTrade3}</p></div>
                <div className="labels-div"><p className="labels">{stats.rctTrade4}</p></div>
                <div className="labels-div"><p className="labels">{stats.rctTrade5}</p></div>
            </div>
        </div>;
    const trades_info_div_bottom = 
        <div id="controls-bottom">
            <div id="controls-trades-info-inner">
                {!usePortraitMode() ? 
                    <div className="hint-div">
                        <small>This area displays action status and recent trades:</small>
                    </div>
                : <></>}
                <div className="labels-div"><p className="labels">{stats.status}</p></div>
                <div className="labels-div"><p className="labels">{stats.rctTrade1}</p></div>
                <div className="labels-div"><p className="labels">{stats.rctTrade2}</p></div>
            </div>
        </div>;

    return (
        <div id="controls" ref={targetRef}>
            <div id="controls-flex">
                { !usePortraitMode() ? trades_info_div_left : <></> }
                <div id="controls-right">
                    <div id="controls-right-top">
                        {!usePortraitMode() ? 
                            <div className="hint-div">
                                <small>Details of your simulated portfolio:</small>
                            </div> 
                        : <></>}
                        <div id="controls-portfolio-details">
                            <div className="labels-div"><p className="labels labels-float">Total Portfolio Value: </p><span className="labels labels-float">{stats.totPortValue.toFixed(1)}</span></div>
                            <div className="labels-div"><p className="labels labels-float">Funds Available: </p><span className="labels labels-float">{stats.fundsAvail.toFixed(1)}</span></div>
                            <div className="labels-div"><p className="labels labels-float">Position Held: </p><span className="labels labels-float">{stats.posHeld}</span></div>
                            <div className="labels-div"><p className="labels labels-float">Position Cost Base: </p><span className="labels labels-float">{stats.posCost.toFixed(2)}</span></div>
                            <div className="labels-div"><p className="labels labels-float">Position Profit/Loss: </p><span className="labels labels-float">{stats.posPL.toFixed(1)}</span></div>
                            <div className="labels-div"><p className="labels labels-float">Position P/L Percentage: </p><span className="labels labels-float">{stats.posPLPerc.toFixed(2) + "%"}</span></div>
                            <br style={{clear: "left"}} />
                        </div>
                    </div>
                    <div id="controls-right-bottom">
                        <div id="controls-right-bottom-left">
                            {!usePortraitMode() ? 
                                <div className="hint-div">
                                    <small>The time in history and the closing price:</small>
                                </div>
                            : <></>}
                            <div><p className="labels" id="output-timestamp">{stats.ts}</p></div>
                            <div><p className="labels" id="output-price">{stats.price.toFixed(2)}</p></div>
                        </div>
                        <div id="controls-right-bottom-middle">
                            {!usePortraitMode() ? 
                                <div className="hint-div">
                                    <small >Trade at the closing price using these controls:</small>
                                </div>
                            : <></>}
                            <div id="controls-trade-div">
                                <Trader />
                            </div>
                        </div>
                        <div id="controls-right-bottom-right">
                            {!usePortraitMode() ? 
                                <div className="hint-div">
                                    <small>Use these buttons to move to the next day(s):</small>
                                </div>
                            : <></>}
                            <div>
                                <Stepper />
                            </div>
                        </div>
                    </div>
                </div>
                <br style={{clear: "left"}} />
            </div>
            { usePortraitMode() ? trades_info_div_bottom : <></> }
        </div>
        
    );
}


export { Controls };