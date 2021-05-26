
import './trainer.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { history } from '../helpers';
import { alertActions } from '../actions';
import { statsActions } from '../actions';
import { StockChart, Controls, Footer, useWindowDimensions } from '../components';


// import StockChartHOC from './components/StockChart';
// import Controls from './components/Controls';
// import Footer from './components/Footer'
// import useWindowDimensions from "./components/WindowDimensions";

// import { withOHLCData } from './data';

import { IOHLCData } from "../data/iOHLCData";
import { parseData } from "../data/withOHLCData"
import { tsvParse } from "d3-dsv";



const dateToYMDStr = (date) => {
  const mm = date.getMonth() + 1;  // getMonth starts from 0
  const dd = date.getDate();
  return `${date.getFullYear()}-${(mm>9? '':'0')}${mm}-${(dd>9? '':'0')}${dd}`;
};

function TrainerPage() {
  const { height, width } = useWindowDimensions();

  const [ dataSet, setDataSet ] = useState("stock01");
  const [ loadToIndex, setLoadToIndex ] = useState(120);
  const [ data, setData ] = useState(IOHLCData);

  const stats = useSelector(state => state.stats.items);
  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch();
  
  
  useEffect(() => {
    if(stats === undefined) {
      console.log("calling init stats");
      dispatch(statsActions.initStats());
    }

    fetchData(dataSet)
    .then((response) => {
      setData(response);
    });
    
  }, [dataSet]);  // this useEffect essentially works like componentDidMount()

  
  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
  }, []);

  useEffect(() => {
    // when stats.currIndex change, update price, portfolio details, and chart data
    if (stats !== undefined && loadToIndex != stats.currIndex) {
      setLoadToIndex(stats.currIndex);
      const newTimestamp = dateToYMDStr(data[loadToIndex]['date']);
      const newPrice = data[loadToIndex]['close'];
      // Total value and Profit/Loss stats need to be updated every bar change
      const newTotalPortfolioValue = stats.fundsAvailable + stats.positionHeld * newPrice;
      const newPositionPL = (newPrice - stats.positionCost) * stats.positionHeld;
      let newPositionPLPercent = 0;  // dafault value to handle div by 0 case
      if (stats.positionHeld != 0) {  // above code should not be placed inside this IF, to handle the case where all asset is sold and positionHeld just becomes 0
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
      dispatch(statsActions.updateStats(tempStats));
    }
  }, [stats]);

  // console.log(stats);


  if(data != undefined){
    return (
      <div>
        <div id="chart-div">
          <StockChart height={height * 0.7 - 80} width={width - 100} data={data.slice(0,loadToIndex)}/>
        </div>
        {/* <h2 style={{color:'red', position: 'fixed', zIndex: 100, left: '30px', top: '10px'}}>Demo only, app currently under construction.</h2> */}
        <Controls />
        <Footer />
      </div>
    );
  }else{
    return (
      <div>
        <h3 className="text-white">Loading data for {dataSet}..</h3>
      </div>
    );
  }

}

function fetchData(dataSet) {
  return fetch(
    `https://www.test-ware.com/data/${dataSet}.tsv`,
    // `../data/${dataSet}.tsv`,
    []
  ).then((response) => response.text())
  .then((data) => tsvParse(data, parseData()))
  .catch((error) => {
      console.log(error);
  });
};


export { TrainerPage };
