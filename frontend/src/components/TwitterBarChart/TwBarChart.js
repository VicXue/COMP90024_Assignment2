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

export default function TwBarChart() {
  const [twData, setTwData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
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
      console.log(twData.data.rows);

      const cur_row = twData.data.rows[0].value;

      const tempData = {
        labels,
        datasets: [
          {
            label: "1gsyd",
            data: [
              cur_row.negative_score_avg,
              cur_row.neutral_score_avg,
              cur_row.positive_score_avg,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
          },
        ],
      };

      setChartData(tempData);
    }
  }, [twData]);

  if (chartData) return <Bar options={options} data={chartData} />;
}
