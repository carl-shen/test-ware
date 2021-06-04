
export const MACDCalc = function (data: any[], slowP = 26, fastP = 12, signalP = 9) {
    const emaSlow = EMACalc(data, slowP);
    const emaFast = EMACalc(data, fastP);
    const macdLine = emaFast.map((item, index) => item - emaSlow[index]);  // emaFast - emaSlow, element-wise subtraction
    const signalLine = EMACalc(macdLine, signalP);
    const macdHist = macdLine.map((item, index) => item - signalLine[index]);  // macdLine - signalLine, element-wise subtraction
    return { macdLine: macdLine, signalLine: signalLine, macdHist: macdHist };
}

function EMACalc(data: any[], period: number) {
    const k = 2/(period + 1);
    let ema = [data[0]];  // first item is the same as the first item in original data
    for (var i = 1; i < data.length; i++) {  // for the rest of the items
        ema.push(data[i] * k + ema[i - 1] * (1 - k));  // calculate with correct weight
    }
    return ema;
}