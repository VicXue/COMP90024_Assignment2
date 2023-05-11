import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Mastodon Non-Mental Dataset Pie Chart",
    },
  },
};

const labels = [
  "Avg Negative Score",
  "Avg Neutral Score",
  "Avg Positive Score",
];

export default function NonMental() {
  const [mentalData, setmentalData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // `${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/mastodon/non-mental/ouput`
          "http://172.26.134.155:8080/api/v1/mastodon/non-mental/output"
        );
        const jsonData = await response.json();
        setmentalData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (mentalData) {
      console.log(mentalData);
      // console.log(mentalData.data.rows);

      const cur_row = mentalData.data.rows[0].value;

      const tempData = {
        labels,
        datasets: [
          {
            label: "Non-Mental Dataset",
            data: [
              cur_row.negative_count_avg,
              cur_row.neutral_count_avg,
              cur_row.positive_count_avg,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderWidth: 1,
          },
        ],
      };

      setChartData(tempData);
    }
  }, [mentalData]);

  if (chartData) return <Pie options={options} data={chartData} />;
}
