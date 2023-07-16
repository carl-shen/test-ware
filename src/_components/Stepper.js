import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { statsActions } from "../_actions";
import { usePortraitMode } from "./";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

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
    "flex-1 min-w-stepper-button relative inline-block w-24 px-auto py-2 mr-1 mb-1 overflow-hidden text-base font-normal text-gray-200 uppercase rounded-lg bg-gradient-to-br from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-400 hover:text-white";

  return (
    <div className="flex flex-wrap min-w-xxs">
      <button className={stepButtonClassNames} onClick={() => nextNBar(1)}>
        <span>
          <FontAwesomeIcon icon={icon({ name: "angle-right" })} />
        </span>
      </button>
      <button className={stepButtonClassNames} onClick={() => nextNBar(2)}>
        <span>
          <FontAwesomeIcon icon={icon({ name: "angles-right" })} />
        </span>
      </button>
      <input
        className="flex-1 min-w-stepper-button relative inline-block w-24 pl-3 text-center py-2 mr-1 mb-1 overflow-hidden text-base font-normal text-gray-200 rounded-lg bg-gradient-to-br from-green-500 to-blue-500"
        type="number"
        name="nsteps"
        value={nsteps}
        onChange={handleNStepsChange}
      />
      <button className={stepButtonClassNames} onClick={() => nextNBar(nsteps)}>
        <span>
          <FontAwesomeIcon icon={icon({ name: "angles-right" })} /> N
        </span>
      </button>
    </div>
  );
}

export { Stepper };
