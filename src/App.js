
// import './App.css';
import './trainer.css';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchStats, initStats, postStats, updateStats } from './actions/statsActions';

import StockChartHOC from './components/StockChart';
import Controls from './components/Controls';
import Footer from './components/Footer'
import useWindowDimensions from "./components/WindowDimensions";
// import { withOHLCData } from './data';

import { IOHLCData } from "./data/iOHLCData";
import { parseData } from "./data/withOHLCData"
import { tsvParse } from "d3-dsv";

const dateToYMDStr = (date) => {
  const mm = date.getMonth() + 1;  // getMonth starts from 0
  const dd = date.getDate();
  return `${date.getFullYear()}-${(mm>9? '':'0')}${mm}-${(dd>9? '':'0')}${dd}`;
};

function App( { stats, initStats, updateStats } ) {
  const { height, width } = useWindowDimensions();

  const [ dataSet, setDataSet ] = useState("stock01");
  const [ loadToIndex, setLoadToIndex ] = useState(120);
  const [ data, setData ] = useState(IOHLCData);

  useEffect(() => {
    // when stats.currIndex change, update price, portfolio details, and chart data
    if(!isNaN(stats.currIndex) && loadToIndex != stats.currIndex){
      setLoadToIndex(stats.currIndex);
      const newTimestamp = dateToYMDStr(data[loadToIndex]['date']);
      const newPrice = data[loadToIndex]['close'];
      // Total value and Profit/Loss stats need to be updated every bar change
      const newTotalPortfolioValue = stats.fundsAvailable + stats.positionHeld * newPrice;
      const newPositionPL = (newPrice - stats.positionCost) * stats.positionHeld;
      let newPositionPLPercent = 0;  // dafault value to handle div by 0 case
      if(stats.positionHeld != 0){  // above code should not be placed inside this IF, to handle the case where all asset is sold and positionHeld just becomes 0
        newPositionPLPercent = newPrice / stats.positionCost - 1;
      }

      const tempStats = {
        ...stats,
        timestamp: newTimestamp,
        price: newPrice,
        totalPortfolioValue: newTotalPortfolioValue,
        positionPL: newPositionPL,
        positionPLPercent : newPositionPLPercent
      };
      updateStats(tempStats);
    }
  }, [stats]);


  // console.log(stats);


  useEffect(() => {
    fetchData(dataSet)
    .then((response) => {
      setData(response);
    });

    if(stats.length == 0) {
      initStats();
    }
  }, [dataSet]);  // this useEffect essentially works like componentDidMount()


  if(data != undefined){

    return (
      <div className="App">
        <div id="chart-div">
          <StockChartHOC height={height * 0.7 - 80} width={width - 100} data={data.slice(0,loadToIndex)}/>
        </div>
        <Controls />
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



const mapStateToProps = state => {
  return { stats: state.stats.items };
};

export default connect(mapStateToProps, { initStats, updateStats })(App);
