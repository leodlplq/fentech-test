import { DateTime } from "luxon";
// import { stockData } from "../data";
import { useDataStore } from "../stores/data";

const fetchData = async (datasetOption) => {
  const data = useDataStore();
  const res = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=5min&apikey=ACZYF247P8SJF2JT`
  );
  const stockData = await res.json();

  data.data = stockData;
  data.loaded = true;

  const labels = Object.keys(data.data["Time Series (5min)"]).map((el) =>
    DateTime.fromSQL(el)
  );
  const realData = Object.values(data.data["Time Series (5min)"]).map((el) => {
    return parseFloat(el["1. open"] + el["4. close"] / 2);
  });

  return {
    labels,
    datasets: [{ ...datasetOption, data: realData }],
  };
};

export { fetchData };
