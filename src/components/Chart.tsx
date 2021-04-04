import { ChartData, ChartOptions } from "chart.js";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Base, Node } from "./Types";


const kApiUrl =
    "https://analytics.3divi.ru/api/v2/statistics/user/2088/devices/dates/ages/?key=d3aa35bde5ef46899b91aca9c66e174e&b=2020/03/08%2012:00:00&e=2020/09/08%2012:00:00&tzo=0";


const getAgeGroupData = (rootNode: Node, ageGroup: string): number[] => {
    const result: number[] = [0 ,0, 0, 0, 0, 0, 0];

    rootNode.o.forEach((device) => {
        device.o.forEach((date) => {
            const currentWeekday = new Date(date.n).getDay();
            result[currentWeekday] += date.o.find((age) => age.n === ageGroup )?.v ?? 0;
        });
    });
    return result;
};

export const Chart: FunctionComponent = () => {

    const chartOptions: ChartOptions = {
        scales: {
            xAxes: [
                {
                    stacked: true
                }
            ],
            yAxes: [
                {
                    stacked: true
                }
            ]
        }
    };

    const [chartData, setChartData] = useState<ChartData>({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
        {
            label: "Adult",
            data: [],
        },
        {
            label: "Kid",
            data: [],
        },
        {
            label: "Old",
            data: [],
        },
        {
            label: "Undefined",
            data: [],
        },
        {
            label: "Young",
            data: [],
        }],
    });

    useEffect(() => {
        axios
        .get<Base>(kApiUrl)
        .then((res) => {
            const transformData = (dataSet: Base): ChartData => {

                return {
                    
                    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    datasets: [
                        {
                            label: "Adults",
                            data: getAgeGroupData(dataSet.data, 'adult'),
                            backgroundColor: 'red',
                        },
                        {
                            label: "Kids",
                            data: getAgeGroupData(dataSet.data, 'kid'),
                            backgroundColor: 'blue',
                        },
                        {
                            label: "Elderly",
                            data: getAgeGroupData(dataSet.data, 'old'),
                            backgroundColor: 'yellow',
                        },
                        {
                            label: "Undefined",
                            data: getAgeGroupData(dataSet.data, 'undefined'),
                            backgroundColor: 'pink',
                        },
                        {
                            label: "Youngsters",
                            data: getAgeGroupData(dataSet.data, 'young'),
                            backgroundColor: 'teal',
                        },
                    ]
                };

            };

            setChartData(transformData(res.data));
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return <Bar data={chartData} options={chartOptions} />;
};
