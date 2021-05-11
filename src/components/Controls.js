
import { useState } from 'react'

function Controls({ nextNBar }) {
    
    const controlStyling = {
        position: 'fixed',
        top: '81%'
      };

    const buttonStyling = {
        color: "red"
    };

    const inputStyling = {
        width: "57px"
    };

    const [nsteps, setNSteps] = useState(3);  // default is 3

    const handleNStepsChange = (e) => {
        setNSteps( Math.max(1, Math.min(10, e.target.value)) ); // min 1, max 10
    };

    return (
        <div className="Controls" style={controlStyling} >
            <button style={buttonStyling} onClick={() => nextNBar(1)}>Next bar</button>
            <button style={buttonStyling} onClick={() => nextNBar(2)}>Next 2 bars</button><br/>
            <input type="number" name="nsteps" value={nsteps} onChange={handleNStepsChange} style={inputStyling} />
            <button style={buttonStyling} onClick={() => nextNBar(nsteps)}>Next N bars</button>
        </div>
    );
}



export default Controls;