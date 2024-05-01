import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useStore from "../../utility/hooks/useStore";
export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "看看你是付款還是收款",
    },
  },
};

export function Chart() {
  const { group } = useStore();
  const { totalBill } = group;
  const billNames = Object.keys(totalBill);
  if (billNames.length === 0) return;
  const billAmounts = Object.values(totalBill);
  const data = {
    labels: billNames,
    datasets: [
      {
        label: "款項",
        data: billAmounts,
        backgroundColor: function (context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value < 0
            ? "rgb(255, 99, 132)" // draw negative values in red
            : "rgb(99, 255, 132)";
        },
      },
    ],
  };
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);
  return (
    <Bar
      options={options}
      data={data}
      width={360}
      height={300}
      className="mt-24"
    />
  );
}
