
import { useState } from 'react'


function Controls({ nextNBar }) {
    
    // const inputStyling = {
    //     width: "57px"
    // };

    const [nsteps, setNSteps] = useState(3);  // default is 3
    const [numshares, setNumShares] = useState(10000);  // default is 10,000

    const handleNStepsChange = (e) => {
        setNSteps( Math.max(1, Math.min(10, e.target.value)) ); // min 1, max 10
    };

    const handleNumSharesChange = (e) => {
        setNumShares( Math.max(1, e.target.value) ); // min 1
    };

    return (
        <div id="controls" >
            <div id="controls-left">
                <div id="controls-left-bottom">
                    <div className="hint-div">
                        <small>This area displays action status and recent trades:</small>
                    </div>
                    <div><p className="labels">status</p></div>
                    <div><p className="labels">Most recent trade 1</p></div>
                    <div><p className="labels">Most recent trade 2</p></div>
                    <div><p className="labels">Most recent trade 3</p></div>
                    <div><p className="labels">Most recent trade 4</p></div>
                    <div><p className="labels">Most recent trade 5</p></div>
                </div>
            </div>
            <div id="controls-right">
                <div id="controls-right-top">
                    <div className="hint-div">
                        <small>Details of your simulated portfolio:</small>
                    </div>
                    <div id="controls-portfolio-details">
                        <div><p className="labels">Total Portfolio Value: </p><span className="labels" id="output-total-portfolio-value"></span></div>
                        <div><p className="labels">Funds Available: </p><span className="labels" id="output-funds-available"></span></div>
                        <div><p className="labels">Position Held: </p><span className="labels" id="output-shares-held"></span></div>
                        <div><p className="labels">Position Cost Base: </p><span className="labels" id="output-averaged-cost"></span></div>
                        <div><p className="labels">Position Profit/Loss: </p><span className="labels" id="output-profit-loss"></span></div>
                        <div><p className="labels">Position P/L Percentage: </p><span className="labels" id="output-pl-percent"></span></div>
                    </div>
                </div>
                <div id="controls-right-bottom">
                    <div id="controls-right-bottom-left">
                        <div id="controls-right-bottom-left-top">
                            <div className="hint-div">
                                <small>The time in history and the closing price:</small>
                            </div>
                            <div><p className="labels" id="output-timestamp">timestamp</p></div>
                            <div><p className="labels" id="output-price">price</p></div>
                        </div>
                        <div id="controls-right-bottom-left-bottom">
                            <div className="hint-div">
                                <small >Trade at the price above using these controls:</small>
                            </div>
                            <div id="controls-trade-div">
                                <input id="input-numshares" type="number" name="numshares" value={numshares} onChange={handleNumSharesChange} />
                                <br />
                                <button id="buyButton" onClick={() => nextNBar(1)}>BUY</button>
                                <button id="sellButton" onClick={() => nextNBar(1)}>SELL</button>
                            </div>
                        </div>
                    </div>
                    <div id="controls-right-bottom-right">
                        <div className="hint-div">
                            <small>Use these buttons to move to the next day(s):</small>
                        </div>
                        <div>
                            <button className="stepButton" onClick={() => nextNBar(1)}>Next bar</button>
                            <button className="stepButton" onClick={() => nextNBar(2)}>Next 2 bars</button>
                            <br />
                            <input id="input-nsteps" type="number" name="nsteps" value={nsteps} onChange={handleNStepsChange} />
                            <button className="stepButton" onClick={() => nextNBar(nsteps)}>Next N bars</button>
                        </div>
                    </div>
                </div>
                

            </div>

            

            <br style={{clear: "left"}} />
        </div>
    );
}



export default Controls;