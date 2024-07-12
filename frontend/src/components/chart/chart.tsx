import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Stock } from '../../models/Stocks';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function LineChart({ chartData }: { chartData: Stock }) {
    const labels = chartData.months.map((dataPoint) => dataPoint.date);
    const dataPoints = chartData.months.map((dataPoint) =>
        parseFloat(dataPoint.price) // Parse the price as a float
    );

    const options = {
        responsive: true,

        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Статистика изменения курса ' + chartData.name,
            },
            scales: {
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Цена акции',
                data: dataPoints,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data} />;
}

export default LineChart