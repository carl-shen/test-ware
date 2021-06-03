import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { statsActions } from '../_actions';

function Stepper() {
    const stats = useSelector(state => state.stats.items);
    const dispatch = useDispatch();

    const [nsteps, setNSteps] = useState(3);  // default is 3
    
    const handleNStepsChange = (e) => {
        setNSteps( Math.max(1, Math.min(10, e.target.value)) ); // min 1, max 10
    };

    const nextNBar = (n) => {
        const newLoadToIndex = stats.currIndex + n;
        const tempStats = {
          ...stats,
          currIndex: newLoadToIndex
        };
        dispatch(statsActions.updateStats(tempStats));
        console.log(stats);
    };

    return (
        <div>
            <button className="stepButton" onClick={() => nextNBar(1)}>Next bar</button>
            <button className="stepButton" onClick={() => nextNBar(2)}>Next 2 bars</button>
            <br />
            <input id="input-nsteps" type="number" name="nsteps" value={nsteps} onChange={handleNStepsChange} />
            <button className="stepButton" onClick={() => nextNBar(nsteps)}>Next N bars</button>
        </div>
    )
}


export { Stepper };
