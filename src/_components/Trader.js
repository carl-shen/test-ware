import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { statsActions } from '../_actions';

function Trader() {

    const stats = useSelector(state => state.stats.items);
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    const [numshares, setNumShares] = useState(10000);  // default is 10,000

    const handleNumSharesChange = (e) => {
        setNumShares( Math.max(1, e.target.value) );  // min 1
    };

    const doTrade = (isBuy) => {
        calcTradeCosts(isBuy);
    };

    const calcTradeCosts = (isBuy) => {
        let positionCost = stats.positionCost;
        let positionHeld = stats.positionHeld;
        let fundsAvailable = stats.fundsAvailable;
        let statusText = "";
        let tradeRecord = "";
        let recentTrade5 = stats.recentTrade5;
        let recentTrade4 = stats.recentTrade4;
        let recentTrade3 = stats.recentTrade3;
        let recentTrade2 = stats.recentTrade2;
        let recentTrade1 = stats.recentTrade1;
        if(isBuy){  // Buy trade
            const costOfTrade = numshares * stats.price + calcCommission();
            if(costOfTrade <= stats.fundsAvailable){  // if enough funds available to buy asset
                positionCost = (positionCost * positionHeld + costOfTrade) / (positionHeld + numshares);
                positionHeld = positionHeld + numshares;
                fundsAvailable = stats.fundsAvailable - costOfTrade;
                statusText = "Buy successful.";
                tradeRecord = `${stats.timestamp} Bought ${numshares} shares at ${stats.price.toFixed(2)}, total cost ${costOfTrade.toFixed(1)}`;
            }else{
                statusText = "Insufficient funds.";
                tradeRecord = "NOTRADE";
            }
        }else{  // Sell trade
            const proceedsFromTrade = numshares * stats.price - calcCommission();
            if(positionHeld >= numshares){  // if enough assets available to sell (shorting is not allowed for now)
                if(positionHeld === numshares){  // takes care of div0 case
                    positionCost = 0;
                    positionHeld = 0;
                }else{
                    positionCost = (positionCost * positionHeld - proceedsFromTrade) / (positionHeld - numshares);
                    positionHeld = positionHeld - numshares;
                }
                fundsAvailable = fundsAvailable + proceedsFromTrade;
                statusText = "Sell successful.";
                tradeRecord = `${stats.timestamp} Sold ${numshares} shares at ${stats.price.toFixed(2)}, total proceeds ${proceedsFromTrade.toFixed(1)}`;
            }else{
                statusText = "Not enough asset, shorting not allowed.";
                tradeRecord = "NOTRADE";
            }
        }

        if(tradeRecord !== "NOTRADE"){
            recentTrade5 = stats.recentTrade4;
            recentTrade4 = stats.recentTrade3;
            recentTrade3 = stats.recentTrade2;
            recentTrade2 = stats.recentTrade1;
            recentTrade1 = tradeRecord;
        }

        // update stats
        const tempStats = {
            ...stats,
            positionCost: positionCost,
            positionHeld: positionHeld,
            fundsAvailable: fundsAvailable,
            statusText: statusText,
            recentTrade1: recentTrade1,
            recentTrade2: recentTrade2,
            recentTrade3: recentTrade3,
            recentTrade4: recentTrade4,
            recentTrade5: recentTrade5
        };
        dispatch(statsActions.updateStats(tempStats));
        dispatch(statsActions.postStats(user.id, stats.ticker, stats));

        return tradeRecord;
    };

    const calcCommission = () => {
        const commissionRate = 0.0005;
        return numshares * stats.price * commissionRate;
    };

    return (
        <div>
            <input id="input-numshares" type="number" name="numshares" value={numshares} onChange={handleNumSharesChange} />
            <br />
            <button id="buyButton" onClick={() => doTrade(true)}>BUY</button>
            <button id="sellButton" onClick={() => doTrade(false)}>SELL</button>
        </div>
    )
}


  
export { Trader };