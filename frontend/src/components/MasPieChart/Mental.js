import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: { size: 10 },
        color: "#deebf8",
      },
    },
    title: {
      display: true,
      font: { size: 16 },
      color: "#61dafb",
      text: "Mastodon Mental Dataset (Worldwide)",
    },
    datalabels: {
      anchor: "end",
      align: "start",
      offset: 3,
      color: "#deebf8",
      formatter: (value, ctx) => {
        return (value * 100 + "%").toString();
      },
    },
  },
};

const labels = [
  "Avg Negative Score",
  "Avg Neutral Score",
  "Avg Positive Score",
];

export default function Mental() {
  const [mentalData, setmentalData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/mastodon/mental/output`
        );
        try {
          const jsonData = await response.json();
          setmentalData(jsonData);
        } catch (error) {
          console.error("Error Transforming data:", error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (mentalData) {
      const cur_row = mentalData.data.rows[0].value;

      const tempData = {
        labels,
        datasets: [
          {
            label: "Mental Dataset",
            data: [
              cur_row.negative_count_avg.toFixed(2),
              cur_row.neutral_count_avg.toFixed(2),
              cur_row.positive_count_avg.toFixed(2),
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

  if (chartData) {
    return (
      <div className="mental-chart">
        <Pie options={options} data={chartData} />
      </div>
    );
  }
}
