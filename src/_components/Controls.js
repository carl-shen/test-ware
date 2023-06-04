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

  const labels_className = "text-gray-100";
  const labels_div_classNames = "";

  const hints_className = "text-gray-500 text-sm leading-3 pb-1";

  // Use different layouts for the trades info panel for landscape and portrait modes.
  const trades_info_div_left = (
    <div id="controls-left" className="w-2/6 ml-2">
      <div id="controls-trades-info-inner">
        {!usePortraitMode() ? (
          <p className={hints_className}>
            This area displays action status and recent trades:
          </p>
        ) : (
          <></>
        )}

        <p className={labels_className}>{stats.status}</p>

        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.rctTrade1}</p>
        </div>
        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.rctTrade2}</p>
        </div>
        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.rctTrade3}</p>
        </div>
        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.rctTrade4}</p>
        </div>
        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.rctTrade5}</p>
        </div>
      </div>
    </div>
  );
  const trades_info_div_bottom = (
    <div id="controls-bottom" className="ml-2">
      <div id="controls-trades-info-inner">
        {!usePortraitMode() ? (
          <p className={hints_className}>
            This area displays action status and recent trades:
          </p>
        ) : (
          <></>
        )}
        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.status}</p>
        </div>
        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.rctTrade1}</p>
        </div>
        <div className={labels_div_classNames}>
          <p className={labels_className}>{stats.rctTrade2}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div id="controls" ref={targetRef}>
      <div id="controls-flex">
        {!usePortraitMode() ? trades_info_div_left : <></>}
        <div id="controls-right" className="ml-2">
          <div id="controls-right-top">
            {!usePortraitMode() ? (
              <p className={hints_className}>
                Details of your simulated portfolio:
              </p>
            ) : (
              <></>
            )}
            <div id="controls-portfolio-details">
              <div className={labels_div_classNames}>
                <p className="labels labels-float">Total Portfolio Value: </p>
                <span className="labels labels-float">
                  {stats.totPortValue.toFixed(1)}
                </span>
              </div>
              <div className={labels_div_classNames}>
                <p className="labels labels-float">Funds Available: </p>
                <span className="labels labels-float">
                  {stats.fundsAvail.toFixed(1)}
                </span>
              </div>
              <div className={labels_div_classNames}>
                <p className="labels labels-float">Position Held: </p>
                <span className="labels labels-float">{stats.posHeld}</span>
              </div>
              <div className={labels_div_classNames}>
                <p className="labels labels-float">Position Cost Base: </p>
                <span className="labels labels-float">
                  {stats.posCost.toFixed(2)}
                </span>
              </div>
              <div className={labels_div_classNames}>
                <p className="labels labels-float">Position Profit/Loss: </p>
                <span className="labels labels-float">
                  {stats.posPL.toFixed(1)}
                </span>
              </div>
              <div className={labels_div_classNames}>
                <p className="labels labels-float">Position P/L Percentage: </p>
                <span className="labels labels-float">
                  {stats.posPLPerc.toFixed(2) + "%"}
                </span>
              </div>
              <br style={{ clear: "left" }} />
            </div>
          </div>
          <div id="controls-right-bottom">
            <div id="controls-right-bottom-left">
              {!usePortraitMode() ? (
                <p className={hints_className}>
                  The time in history and the closing price:
                </p>
              ) : (
                <></>
              )}
              <div>
                <p className={labels_className} id="output-timestamp">
                  {stats.ts}
                </p>
              </div>
              <div>
                <p className={labels_className} id="output-price">
                  {stats.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div id="controls-right-bottom-middle">
              {!usePortraitMode() ? (
                <p className={hints_className}>
                  Trade at the closing price using these controls:
                </p>
              ) : (
                <></>
              )}
              <div id="controls-trade-div">
                <Trader />
              </div>
            </div>
            <div id="controls-right-bottom-right">
              {!usePortraitMode() ? (
                <p className={hints_className}>
                  Use these buttons to move to the next day(s):
                </p>
              ) : (
                <></>
              )}
              <div>
                <Stepper />
              </div>
            </div>
          </div>
        </div>
        <br style={{ clear: "left" }} />
      </div>
      {usePortraitMode() ? trades_info_div_bottom : <></>}
    </div>
  );
}

export { Controls };
