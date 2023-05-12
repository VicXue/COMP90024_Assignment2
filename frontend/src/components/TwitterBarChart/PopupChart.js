import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Twitter Bar Chart",
    },
  },
};

const labels = [
  "Avg Negative Score",
  "Avg Neutral Score",
  "Avg Positive Score",
];

export default function PopupChart(props) {
  const [twData, setTwData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // `${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/twitter/sentiment`
          "http://172.26.134.155:8080/api/v1/twitter/sentiment"
        );
        const jsonData = await response.json();
        setTwData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (twData) {
      //   console.log(twData.data.rows);
      // console.log(props.gccName);

      let gccName = props.gccName;
      let rowNum = -1;

      if (gccName === "Greater Sydney") {
        rowNum = 0;
      } else if (gccName === "Greater Melbourne") {
        rowNum = 1;
      } else if (gccName === "Greater Brisbane") {
        rowNum = 2;
      } else if (gccName === "Greater Adelaide") {
        rowNum = 3;
      } else if (gccName === "Greater Perth") {
        rowNum = 4;
      } else if (gccName === "Greater Hobart") {
        rowNum = 5;
      } else if (gccName === "Greater Darwin") {
        rowNum = 6;
      } else if (gccName === "Australian Capital Territory") {
        rowNum = 7;
      }

      const cur_row = twData.data.rows[rowNum].value;

      const tempData = {
        labels,
        datasets: [
          {
            label: gccName,
            data: [
              cur_row.negative_score_avg,
              cur_row.neutral_score_avg,
              cur_row.positive_score_avg,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
            ],
          },
        ],
      };

      setChartData(tempData);
    }
  }, [twData, props]);

  if (chartData) {
    return (
      <div className="tw-chart">
        <Bar options={options} data={chartData} />
        {/* <p>{props.gccName.name}</p> */}
      </div>
    );
  }
}
