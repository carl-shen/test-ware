import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { statsActions } from "../_actions";
import { usePortraitMode } from "./";

// By default, the steps to move forward is 3, i.e. 3 candles.
const DEFAULT_STEP_SIZE = 3;

function Stepper() {
  const stats = useSelector((state) => state.stats.items);
  const dispatch = useDispatch();

  const [nsteps, setNSteps] = useState(DEFAULT_STEP_SIZE);

  const handleNStepsChange = (e) => {
    setNSteps(Math.max(1, Math.min(100, e.target.value)));
  };

  const nextNBar = (n) => {
    const newLoadToIndex = stats.currIndex + n;
    const tempStats = {
      ...stats,
      currIndex: newLoadToIndex,
    };
    dispatch(statsActions.updateStats(tempStats));
  };

  return (
    <div>
      <button className="stepButton" onClick={() => nextNBar(1)}>
        Next bar
      </button>
      <button className="stepButton" onClick={() => nextNBar(2)}>
        Next 2{usePortraitMode() ? "" : " bars"}
      </button>
      <br />
      <input
        id="input-nsteps"
        type="number"
        name="nsteps"
        value={nsteps}
        onChange={handleNStepsChange}
      />
      <button className="stepButton" onClick={() => nextNBar(nsteps)}>
        Next N{usePortraitMode() ? "" : " bars"}
      </button>
    </div>
  );
}

export { Stepper };
