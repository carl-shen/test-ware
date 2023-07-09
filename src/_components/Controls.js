import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../_actions";
import { Trader, Stepper, getWindowDimensions, usePortraitMode } from "./";

function Controls() {
  const targetRef = useRef();
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const stats = useSelector((state) => state.stats.items);

  const windowWidth = getWindowDimensions().width;
  const windowHeight = getWindowDimensions().height;

  useEffect(() => {
    // Dispatch the component's own height when the its height changes.
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
  }, [app, dispatch, windowWidth, windowHeight]);

  const labelsClassNames = "text-gray-100 leading-none";
  const sectionDivCommonClassNames = "mt-1";

  const hintsClassNames =
    "hidden lg:inline-block text-gray-500 text-sm leading-3 pb-1";

  // Use different layouts for the trades info panel for landscape and portrait modes.
  const trades_info = (
    <div
      id="trades-info"
      className={sectionDivCommonClassNames + " w-2/6 ml-2"}
    >
      <div id="controls-trades-info-inner">
        <p className={hintsClassNames}>Action status and recent trades:</p>

        <p className={labelsClassNames}>{stats.status}</p>

        <div>
          <p className={labelsClassNames}>{stats.rctTrade1}</p>
        </div>
        <div>
          <p className={labelsClassNames}>{stats.rctTrade2}</p>
        </div>
        <div>
          <p className={labelsClassNames}>{stats.rctTrade3}</p>
        </div>
        <div className="hidden lg:inline">
          <p className={labelsClassNames}>{stats.rctTrade4}</p>
        </div>
        <div className="hidden lg:inline">
          <p className={labelsClassNames}>{stats.rctTrade5}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div id="controls" ref={targetRef}>
      <div className="flex">
        <div className="ml-2">
          <div className={sectionDivCommonClassNames}>
            <p className={hintsClassNames}>
              Details of your simulated portfolio:
            </p>

            <div
              id="controls-portfolio-details"
              className={sectionDivCommonClassNames}
            >
              <div>
                <p className="labels labels-float">Total Portfolio Value: </p>
                <span className="labels labels-float">
                  {stats.totPortValue.toFixed(1)}
                </span>
              </div>
              <div>
                <p className="labels labels-float">Funds Available: </p>
                <span className="labels labels-float">
                  {stats.fundsAvail.toFixed(1)}
                </span>
              </div>
              <div>
                <p className="labels labels-float">Position Held: </p>
                <span className="labels labels-float">{stats.posHeld}</span>
              </div>
              <div>
                <p className="labels labels-float">Position Cost Base: </p>
                <span className="labels labels-float">
                  {stats.posCost.toFixed(2)}
                </span>
              </div>
              <div>
                <p className="labels labels-float">Position Profit/Loss: </p>
                <span className="labels labels-float">
                  {stats.posPL.toFixed(1)}
                </span>
              </div>
              <div>
                <p className="labels labels-float">Position P/L Percentage: </p>
                <span className="labels labels-float">
                  {stats.posPLPerc.toFixed(2) + "%"}
                </span>
              </div>
              <br style={{ clear: "left" }} />
            </div>
          </div>
          <div
            id="controls-bottom"
            className={sectionDivCommonClassNames + " flex"}
          >
            <div
              id="controls-price"
              className={sectionDivCommonClassNames + " mr-2 lg:mr-4 flex-1"}
            >
              <p className={hintsClassNames}>
                The time in history and the closing price:
              </p>

              <div>
                <p className={labelsClassNames} id="output-timestamp">
                  {stats.ts}
                </p>
              </div>
              <div>
                <p className={labelsClassNames} id="output-price">
                  {stats.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div
              id="controls-trader"
              className={sectionDivCommonClassNames + " mr-2 lg:mr-4 flex-1"}
            >
              <p className={hintsClassNames}>
                Trade at the closing price with these:
              </p>

              <div className={sectionDivCommonClassNames}>
                <Trader />
              </div>
            </div>
            <div
              id="controls-stepper"
              className={sectionDivCommonClassNames + " flex-1"}
            >
              <p className={hintsClassNames}>
                Use these buttons to move to the next day(s):
              </p>

              <div className={sectionDivCommonClassNames}>
                <Stepper />
              </div>
            </div>
            {trades_info}
          </div>
        </div>
        <br style={{ clear: "left" }} />
      </div>
    </div>
  );
}

export { Controls };
