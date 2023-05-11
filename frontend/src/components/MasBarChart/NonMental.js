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
      text: "Mastodon Bar Chart",
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
            label: "Non-Mental",
            data: [
              cur_row.negative_count_avg,
              cur_row.neutral_count_avg,
              cur_row.positive_count_avg,
            ],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };

      setChartData(tempData);
    }
  }, [mentalData]);

  if (chartData) return <Bar options={options} data={chartData} />;
}
