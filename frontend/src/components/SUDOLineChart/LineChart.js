import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      font: { size: 28 },
      text: "Recurrent expenditure hisotry in mental health in VIC",
    },
    datalabels: {
      anchor: "end",
      align: "end",
      offset: 0,
      formatter: (value, ctx) => {
        return (value / 1000).toFixed(0) + "K";
      },
    },
  },
};

function LineChart() {
  const API_URL = process.env.REACT_APP_BACKEND_API_HOST;
  const [vicData, setVicData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const newLabels = [
    "2010-2011",
    "2011-2012",
    "2012-2013",
    "2013-2014",
    "2014-2015",
    "2015-2016",
    "2017-2018",
    "2018-2019",
    "2019-2020",
    "2020-2021",
  ];

  useEffect(() => {
    const fetchJSON = async () => {
      try {
        const response = await fetch(
          API_URL + ":8080/api/v1/analysis/victoria-expenses"
        );
        const data = await response.json();

        setVicData(data.data.expenses);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchJSON();
  }, []);

  useEffect(() => {
    if (vicData) {
      let datasets = [];

      vicData.map((expense) => {
        let rgb1 = Math.floor(Math.random() * 255).toString();
        let rgb2 = Math.floor(Math.random() * 255).toString();
        let rgb3 = Math.floor(Math.random() * 255).toString();

        let dataset = {
          label: expense["Expenditure section"],
          data: [
            expense["2010-11"].replace(",", ""),
            expense["2011-12"].replace(",", ""),
            expense["2012-13"].replace(",", ""),
            expense["2013-14"].replace(",", ""),
            expense["2014-15"].replace(",", ""),
            expense["2015-16"].replace(",", ""),
            expense["2016-17"].replace(",", ""),
            expense["2017-18"].replace(",", ""),
            expense["2018-19"].replace(",", ""),
            expense["2019-20"].replace(",", ""),
            expense["2020-21"].replace(",", ""),
          ],
          borderColor: `rgb(${rgb1}, ${rgb2}, ${rgb3})`,
          backgroundColor: `rgb(${rgb1}, ${rgb2}, ${rgb3}, 0.5)`,
          hidden: true,
        };

        datasets.push(dataset);

        return dataset;
      });

      datasets.pop(-1);
      setChartData({ labels: newLabels, datasets: datasets });
    }
  }, [vicData]);

  return (
    <div className="sudo-area">
      {chartData ? (
        <div>
          <Line className="line-chart" options={options} data={chartData} />
          <p className="sudo-para"> Source: ?????????????????????</p>
        </div>
      ) : null}
    </div>
  );
}

export default LineChart;
