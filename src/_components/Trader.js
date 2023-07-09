import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { statsActions } from "../_actions";
import { roundToDefaultDecimal } from "../_helpers";

function Trader() {
  const stats = useSelector((state) => state.stats.items);
  const user = useSelector((state) => state.authentication.user);
  const dispatch = useDispatch();

  const [numshares, setNumShares] = useState(10000); // default is 10,000

  const handleNumSharesChange = (e) => {
    setNumShares(Math.max(1, e.target.value)); // min 1
  };

  const doTrade = (isBuy) => {
    calcTradeCosts(isBuy);
  };

  const calcTradeCosts = (isBuy) => {
    let positionCost = stats.posCost;
    let positionHeld = stats.posHeld;
    let fundsAvailable = stats.fundsAvail;
    let statusText = "";
    let tradeRecord = "";
    let recentTrade5 = stats.rctTrade5;
    let recentTrade4 = stats.rctTrade4;
    let recentTrade3 = stats.rctTrade3;
    let recentTrade2 = stats.rctTrade2;
    let recentTrade1 = stats.rctTrade1;
    if (isBuy) {
      // Process a Buy trade.
      const costOfTrade = numshares * stats.price + calcCommission();
      if (costOfTrade <= fundsAvailable) {
        // If there are enough funds available to execute this Buy trade.
        positionCost =
          (positionCost * positionHeld + costOfTrade) /
          (positionHeld + numshares);
        positionHeld = positionHeld + numshares;
        fundsAvailable = fundsAvailable - costOfTrade;
        statusText = "Buy successful.";
        tradeRecord = `${
          stats.ts
        } Bought ${numshares} shares at ${stats.price.toFixed(
          2
        )}, total cost ${costOfTrade.toFixed(1)}`;
      } else {
        statusText = "Insufficient funds.";
        tradeRecord = "NOTRADE";
      }
    } else {
      // Process a Sell trade.
      const proceedsFromTrade = numshares * stats.price - calcCommission();
      if (positionHeld >= numshares) {
        // If there are enough assets available to execute this Sell trade (shorting is not allowed).
        if (positionHeld === numshares) {
          // Simply set the position values to 0 to avoid division of zero for this case.
          positionCost = 0;
          positionHeld = 0;
        } else {
          positionCost =
            (positionCost * positionHeld - proceedsFromTrade) /
            (positionHeld - numshares);
          positionHeld = positionHeld - numshares;
        }
        fundsAvailable = fundsAvailable + proceedsFromTrade;
        statusText = "Sell successful.";
        tradeRecord = `${
          stats.ts
        } Sold ${numshares} shares at ${stats.price.toFixed(
          2
        )}, total proceeds ${proceedsFromTrade.toFixed(1)}`;
      } else {
        statusText = "Not enough asset, shorting not allowed.";
        tradeRecord = "NOTRADE";
      }
    }

    if (tradeRecord !== "NOTRADE") {
      recentTrade5 = stats.rctTrade4;
      recentTrade4 = stats.rctTrade3;
      recentTrade3 = stats.rctTrade2;
      recentTrade2 = stats.rctTrade1;
      recentTrade1 = tradeRecord;
    }

    // Update stats object.
    const tempStats = {
      ...stats,
      posCost: roundToDefaultDecimal(positionCost),
      posHeld: positionHeld,
      fundsAvail: roundToDefaultDecimal(fundsAvailable),
      status: statusText,
      rctTrade1: recentTrade1,
      rctTrade2: recentTrade2,
      rctTrade3: recentTrade3,
      rctTrade4: recentTrade4,
      rctTrade5: recentTrade5,
    };
    dispatch(statsActions.updateStats(tempStats));
    if (user !== undefined) {
      // Only post stats if user is logged in. Data is not uploaded to server in guest mode.
      dispatch(statsActions.postStats(user.id, stats.ticker, stats));
    }

    return tradeRecord;
  };

  const calcCommission = () => {
    const commissionRate = 0.0005;
    return numshares * stats.price * commissionRate;
  };

  const tradeButtonClassNames =
    "flex-1 relative inline-block min-w-trainer-button py-2 mr-1 mb-1 overflow-hidden text-base font-normal text-gray-200 uppercase rounded-lg bg-gradient-to-br from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-400 hover:text-white";

  return (
    <div className="flex flex-wrap max-w-xxs">
      <input
        className="flex-auto relative inline-block w-32 lg:48 text-center pl-3 py-2 mr-1 mb-1 overflow-hidden text-base font-normal text-gray-200 rounded-lg bg-gradient-to-br from-green-500 to-blue-500"
        type="number"
        name="numshares"
        value={numshares}
        onChange={handleNumSharesChange}
      />
      <div className="flex-auto flex">
        <button className={tradeButtonClassNames} onClick={() => doTrade(true)}>
          BUY
        </button>
        <button
          className={tradeButtonClassNames}
          onClick={() => doTrade(false)}
        >
          SELL
        </button>
      </div>
    </div>
  );
}

export { Trader };
