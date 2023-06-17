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

  const stepButtonClassNames =
    "relative inline-block w-24 px-auto py-1.5 mr-1 mb-1 overflow-hidden text-base font-normal text-gray-200 uppercase rounded-lg bg-gradient-to-br from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-400 hover:text-white";

  return (
    <div>
      <button className={stepButtonClassNames} onClick={() => nextNBar(1)}>
        <span>Next bar</span>
      </button>
      <button className={stepButtonClassNames} onClick={() => nextNBar(2)}>
        <span>Next 2</span>
      </button>
      <br />
      <input
        className="relative inline-block w-24 px-3 py-1.5 mr-1 mb-1 overflow-hidden text-base font-normal text-gray-200 rounded-lg bg-gradient-to-br from-green-500 to-blue-500"
        type="number"
        name="nsteps"
        value={nsteps}
        onChange={handleNStepsChange}
      />
      <button className={stepButtonClassNames} onClick={() => nextNBar(nsteps)}>
        <span>Next N</span>
      </button>
    </div>
  );
}

export { Stepper };
