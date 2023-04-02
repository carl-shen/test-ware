import { tsvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";
import * as React from "react";
import { IOHLCData } from "./iOHLCData";

const parseDate = timeParse("%Y-%m-%d");

export const parseData = () => {
  return (d: any) => {
    const date = parseDate(d.date);
    if (date === null) {
      d.date = new Date(Number(d.date));
    } else {
      d.date = new Date(date);
    }

    for (const key in d) {
      if (key !== "date" && Object.prototype.hasOwnProperty.call(d, key)) {
        d[key] = +d[key];
      }
    }

    return d as IOHLCData;
  };
};

interface WithOHLCDataProps {
  readonly data: IOHLCData[];
}

interface WithOHLCState {
  data?: IOHLCData[];
  endIndex?: number;
  message: string;
}

export function withOHLCData(dataSet = "DAILY", loadToIndex = 80) {
  return <TProps extends WithOHLCDataProps>(
    OriginalComponent: React.ComponentClass<TProps>
  ) => {
    return class WithOHLCData extends React.Component<
      Omit<TProps, "data">,
      WithOHLCState
    > {
      public constructor(props: Omit<TProps, "data">) {
        super(props);

        this.state = {
          message: `Loading ${dataSet} data...`,
        };
      }

      public fetchData() {
        console.log("fetching data..");
        fetch(
          // `https://raw.githubusercontent.com/reactivemarkets/react-financial-charts/master/packages/stories/src/data/${dataSet}.tsv`,
          `https://www.test-ware.com/data/${dataSet}.tsv`
        )
          .then((response) => response.text())
          .then((data) => tsvParse(data, parseData()))
          .then((data) => {
            this.setState({
              data,
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              message: `Failed to fetch data.`,
            });
          });
      }

      public render() {
        const { data, endIndex, message } = this.state;
        if (data === undefined) {
          return <div className="center">{message}</div>;
        }

        console.log(endIndex);
        console.log(data.slice(0, endIndex));

        return (
          <OriginalComponent
            {...(this.props as TProps)}
            data={data.slice(0, endIndex)}
          />
        );
      }
    };
  };
}
