import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function PopupChart(props) {
  const [twData, setTwData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_HOST}:8080/api/v1/twitter/sentiment`
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
    const labels = [
      "Avg Negative Score",
      "Avg Neutral Score",
      "Avg Positive Score",
    ];

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
              cur_row.negative_score_avg.toFixed(2),
              cur_row.neutral_score_avg.toFixed(2),
              cur_row.positive_score_avg.toFixed(2),
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
  }, [twData, props]);

  if (chartData) {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#deebf8",
          },
        },
        title: {
          display: true,
          color: "#61dafb",
          text: props.gccName + " - Twitter Dataset Pie Chart",
        },
        datalabels: {
          anchor: "end",
          align: "start",
          offset: 1.5,
          color: "#deebf8",
          formatter: (value, ctx) => {
            return (value * 100).toString().substring(0, 2) + "%";
          },
        },
      },
    };

    return (
      <div className="popup-chart">
        <Pie options={options} data={chartData} />
      </div>
    );
  }
}
