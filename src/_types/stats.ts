export interface Stats {
  ticker: string;
  currIndex: number;
  ts: string; // timestamp
  price: number;
  totPortValue: number; // total portfolio value
  fundsAvail: number; // funds available
  posHeld: number; // position held
  posCost: number;
  posPL: number;
  posPLPerc: number; // position PL percentage
  status: string;
  rctTrade1: string;
  rctTrade2: string;
  rctTrade3: string;
  rctTrade4: string;
  rctTrade5: string;
  stIndex: number;
  stPortValue: number; // starting portfolio value
  endIndex: number; // length of the challenge data, will be updated once data is properly initialised
  progress: number; // a percentage value, e.g. 0.50 means 50%
  gain: number; // current performance of the portfolio since challenge start
  // trades: []
}

export interface PortfolioPerformance {
  duration: string;
  gain: string;
  CAGR: string;
}
