import React from "react";
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
        // if (value > 0.04) {
        //   return (value * 100 + "%").toString();
        // } else {
        //   return "";
        // }
      },
    },
  },
};

const labels = [
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

export const data = {
  labels,
  datasets: [
    {
      label: "Public psychiatric hospitals",
      data: [
        42208, 40821, 40483, 44445, 50024, 47502, 48593, 58459, 66707, 77588,
        82698,
      ],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      hidden: true,
    },
    {
      label: "Specialised psychiatric units or wards in public acute hospitals",
      data: [
        271298, 274569, 286299, 303415, 320307, 342520, 385505, 443953, 494743,
        512589, 526368,
      ],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      hidden: true,
    },
    {
      label: "Community mental health care services",
      data: [
        368771, 394360, 401606, 426146, 424055, 443579, 471476, 583704, 597063,
        651960, 706545,
      ],
      borderColor: "rgb(228, 25, 167)",
      backgroundColor: "rgba(228, 25, 167, 0.5)",
      hidden: true,
    },
    {
      label: "Residential mental health services",
      data: [
        164361, 164144, 172086, 190790, 189861, 187579, 192786, 204492, 228836,
        231965, 230766,
      ],
      borderColor: "rgb(212, 219, 19)",
      backgroundColor: "rgba(212, 219, 19, 0.5)",
      hidden: true,
    },
    {
      label: "Grants to non-government organisations",
      data: [
        80406, 83643, 89429, 101296, 106761, 110883, 113882, 116711, 108982,
        60163, 97983,
      ],
      borderColor: "rgb(72, 11, 216)",
      backgroundColor: "rgba(72, 11, 216, 0.5)",
      hidden: true,
    },
    {
      label: "Other indirect expenditure",
      data: [
        58336, 56086, 56387, 58814, 68022, 71005, 75017, 91811, 99023, 119558,
        148536,
      ],
      borderColor: "rgb(8, 196, 102)",
      backgroundColor: "rgba(8, 196, 102, 0.5)",
      hidden: true,
    },
  ],
};

export default function LineChart() {
  return (
    <div className="sudo-chart">
      <Line className="line-chart" options={options} data={data} />
    </div>
  );
}
