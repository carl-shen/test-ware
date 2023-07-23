import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { appActions } from "_actions";
import { getWindowDimensions } from "./";

function Footer() {
  const targetRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const app: Record<string, any> = useSelector((state: RootState) => state.app);

  const { width: windowWidth, height: windowHeight } = getWindowDimensions();

  useEffect(() => {
    // Dispatch the component's own height when its height changes.
    if (targetRef.current) {
      const height = targetRef.current.offsetHeight;
      if (app !== undefined) {
        if (app.FooterHeight !== height) {
          dispatch(appActions.updateComponentSize("FooterHeight", height));
        }
      }
    }
  }, [app, dispatch, windowWidth, windowHeight]);

  return (
    <div
      className="text-gray-500 text-xs leading-3 fixed bottom-1 pt-1 px-1"
      ref={targetRef}
    >
      <p>
        &copy; 2023 Test-Ware.com. This website is provided for entertainment
        use only. No information constitutes financial advice. Performance
        scores in this simulation may not reflect potential performance in real
        markets. Financial market conditions change constantly and risk is high.
        Please consult professional financial advisors before trading in the
        real markets.
      </p>
    </div>
  );
}

export { Footer };
