import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import * as React from "react";
import {
  macd,
  sma,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  MACDTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize,
  MACDSeries
} from "react-financial-charts";
import { IOHLCData, withOHLCData } from "../_data";


interface StockChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly dateTimeFormat?: string;
  readonly width: number;
  readonly ratio: number;
}

class StockChart extends React.Component<StockChartProps> {
  private readonly margin = { left: 0, right: 48, top: 0, bottom: 24 };
  private readonly pricesDisplayFormat = format(".2f");
  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d: IOHLCData) => d.date,
  );

  public render() {
    const { data: initialData, height, dateTimeFormat = "%d %b", width, ratio } = this.props;

    const gridLineColour = "RGBA(255,255,255,0.1)";
    const axisColour = "RGBA(255,255,255,0.5)";
    const tickLabelColour = "RGBA(255,255,255,0.5)";

    const sma5 = sma()
      .id(1)
      .options({ windowSize: 5 })
      .merge((d: any, c: any) => {
          d.sma5 = c;
      })
      .accessor((d: any) => d.sma5);

    const sma10 = sma()
      .id(2)
      .options({ windowSize: 10 })
      .merge((d: any, c: any) => {
          d.sma10 = c;
      })
      .accessor((d: any) => d.sma10);

    const macdCalculator = macd()
      .options({
        fast: 12,
        signal: 9,
        slow: 26,
      })
      .merge((d: any, c: any) => {
        d.macd = c;
      })
      .accessor((d: any) => d.macd);

    const macdAppearance = {
        fillStyle: {
            divergence: "#e0714f",
        },
        strokeStyle: {
            macd: "#0093FF",
            signal: "#D84315",
            zero: "rgba(0, 0, 0, 0.3)",
        }
    };


    const calculatedData = macdCalculator(sma10(sma5(initialData)));

    const { margin, xScaleProvider } = this;

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max + 5];

    const gridHeight = height - margin.top - margin.bottom;

    const secondIndicatorHeight = 150;
    const secondIndicatorOrigin = (_: number, h: number) => [0, h - secondIndicatorHeight];
    const barChartHeight = gridHeight / 4;
    const barChartOrigin = (_: number, h: number) => [0, h - barChartHeight - secondIndicatorHeight];
    const chartHeight = gridHeight - secondIndicatorHeight;

    const timeDisplayFormat = timeFormat(dateTimeFormat);

    return (
      <ChartCanvas
          height={height}
          ratio={ratio}
          width={width}
          margin={margin}
          data={data}
          displayXAccessor={displayXAccessor}
          seriesName="Data"
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={xExtents}
          zoomAnchor={lastVisibleItemBasedZoomAnchor}
      >
          <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={this.barChartExtents}>
              <BarSeries fillStyle={this.volumeColor} yAccessor={this.volumeSeries} />
          </Chart>
          <Chart id={3} height={chartHeight} yExtents={this.candleChartExtents}>
              <XAxis showGridLines gridLinesStrokeStyle={gridLineColour} strokeStyle={axisColour} showTicks={false} showTickLabel={false} />
              <YAxis showGridLines gridLinesStrokeStyle={gridLineColour} strokeStyle={axisColour} tickFormat={this.pricesDisplayFormat} tickLabelFill={tickLabelColour} />
              <CandlestickSeries />
              <LineSeries yAccessor={sma5.accessor()} strokeStyle={sma5.stroke()} />
              <CurrentCoordinate yAccessor={sma5.accessor()} fillStyle={sma5.stroke()} />
              <LineSeries yAccessor={sma10.accessor()} strokeStyle={sma10.stroke()} />
              <CurrentCoordinate yAccessor={sma10.accessor()} fillStyle={sma10.stroke()} />
              <MouseCoordinateY rectWidth={margin.right} displayFormat={this.pricesDisplayFormat} />
              <EdgeIndicator
                  itemType="last"
                  rectWidth={margin.right}
                  fill={this.openCloseColor}
                  lineStroke={this.openCloseColor}
                  displayFormat={this.pricesDisplayFormat}
                  yAccessor={this.yEdgeIndicator}
              />
              <MovingAverageTooltip
                  origin={[8, 24]}
                  options={[
                      {
                          yAccessor: sma5.accessor(),
                          type: "SMA",
                          stroke: sma5.stroke(),
                          windowSize: sma5.options().windowSize,
                      },
                      {
                          yAccessor: sma10.accessor(),
                          type: "SMA",
                          stroke: sma10.stroke(),
                          windowSize: sma10.options().windowSize,
                      },
                  ]}
              />

              <ZoomButtons />
              <OHLCTooltip origin={[8, 16]} />
          </Chart>
          <Chart
              id={4}
              height={secondIndicatorHeight}
              yExtents={[0, macdCalculator.accessor()]}
              origin={secondIndicatorOrigin}
              padding={{ top: 8, bottom: 8 }}
          >
              <XAxis showGridLines gridLinesStrokeStyle={gridLineColour} tickLabelFill={tickLabelColour} strokeStyle={axisColour} />
              <YAxis ticks={4} tickFormat={this.pricesDisplayFormat} tickLabelFill={tickLabelColour} strokeStyle={axisColour} />

              <MouseCoordinateX displayFormat={timeDisplayFormat} />
              <MouseCoordinateY rectWidth={margin.right} displayFormat={this.pricesDisplayFormat} />

              <MACDSeries yAccessor={macdCalculator.accessor()} fillStyle={{divergence:"#e0714f"}} />

              <MACDTooltip
                  origin={[8, 16]}
                  appearance={macdAppearance}
                  options={macdCalculator.options()}
                  yAccessor={macdCalculator.accessor()}
              />
          </Chart>
          <CrossHairCursor />
      </ChartCanvas>
    );
  }

  private readonly barChartExtents = (data: IOHLCData) => {
    return data.volume;
  };

  private readonly candleChartExtents = (data: IOHLCData) => {
      return [data.high, data.low];
  };

  private readonly yEdgeIndicator = (data: IOHLCData) => {
      return data.close;
  };

  private readonly volumeColor = (data: IOHLCData) => {
      return data.close > data.open ? "rgba(38, 166, 154, 0.3)" : "rgba(239, 83, 80, 0.3)";
  };

  private readonly volumeSeries = (data: IOHLCData) => {
      return data.volume;
  };

  private readonly openCloseColor = (data: IOHLCData) => {
      return data.close > data.open ? "#26a69a" : "#ef5350";
  };

}



const chartStyle = {
    minHeight: window.innerHeight * 0.2
};

// export default withOHLCData()(withSize({ style: chartStyle })(withDeviceRatio()(StockChart)));
// export default withOHLCData()(withDeviceRatio()(StockChart));
export default withDeviceRatio()(StockChart);


// export const MinutesStockChart = withOHLCData("MINUTES")(
//     withSize({ style: chartStyle })(withDeviceRatio()(StockChart)),
// );

// export const SecondsStockChart = withOHLCData("SECONDS")(
//     withSize({ style: chartStyle })(withDeviceRatio()(StockChart)),
// );



