export const MACDCalc = function (
  data: any[],
  slowP = 26,
  fastP = 12,
  signalP = 9
) {
  const emaSlow = EMACalc(data, slowP);
  const emaFast = EMACalc(data, fastP);
  const macdLine = emaFast.map((item, index) => item - emaSlow[index]);
  const signalLine = EMACalc(macdLine, signalP);
  const macdHist = macdLine.map((item, index) => item - signalLine[index]);
  return { macdLine: macdLine, signalLine: signalLine, macdHist: macdHist };
};

function EMACalc(data: any[], period: number) {
  const k = 2 / (period + 1);
  let ema = [data[0]];
  for (var i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}
