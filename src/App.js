
// import './App.css';
import './trainer.css'
import { useState, useEffect } from 'react'
import StockChartHOC from './components/StockChart';
import Controls from './components/Controls';
import Footer from './components/Footer'
import useWindowDimensions from "./components/WindowDimensions";
// import { withOHLCData } from './data';

import { IOHLCData } from "./data/iOHLCData";
import { parseData } from "./data/withOHLCData"
import { tsvParse } from "d3-dsv";


function App() {
  const { height, width } = useWindowDimensions();

  const [ dataSet, setDataSet ] = useState("stock01");
  const [ loadToIndex, setLoadToIndex ] = useState(120);



  const nextNBar = (n) => {
    setLoadToIndex(loadToIndex+n);
  };


  const [ data, setData ] = useState(IOHLCData);

  useEffect(() => {
    fetchData(dataSet)
    .then((response) => {
      setData(response);
    });
  }, [dataSet]);  // this useEffect essentially works like componentDidMount()


  if(data != undefined){

    return (
    
      <div className="App">
        <div id="chart-div">
          <StockChartHOC height={height * 0.7 - 80} width={width - 100} data={data.slice(0,loadToIndex)}/>
        </div>
        <Controls nextNBar={nextNBar}/>
        <Footer />
      </div>
    );
  }else{
    return (
      <div className="App">
        <h1>Loading data for {dataSet}..</h1>
      </div>
    );

  }

}

function fetchData(dataSet) {
  return fetch(
    `https://www.test-ware.com/data/${dataSet}.tsv`,
  ).then((response) => response.text())
  .then((data) => tsvParse(data, parseData()))
  .catch((error) => {
      console.log(error);
  });

};

export default App;
