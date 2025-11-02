import React from 'react';
import { EvaluationScores } from '../types';

interface BarChartProps {
    scores: EvaluationScores;
}

const BarChart: React.FC<BarChartProps> = ({ scores }) => {
    const data = [
        { label: 'Clarity', value: scores.clarity.score, color: 'bg-sky-500' },
        { label: 'Feasibility', value: scores.feasibility.score, color: 'bg-emerald-500' },
        { label: 'Innovation', value: scores.innovation.score, color: 'bg-purple-500' },
        { label: 'Market', value: scores.marketUnderstanding.score, color: 'bg-amber-500' },
        { label: 'Financials', value: scores.financialViability.score, color: 'bg-green-500' },
    ];

    const maxValue = 100;

    return (
        <div className="w-full h-full flex flex-col justify-between p-4 glassmorphism rounded-lg relative transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.03]">
            <div className="relative">
                <h4 className="text-md font-semibold text-gray-200 mb-4 text-center">Score Breakdown</h4>
                <div className="flex-grow flex justify-around items-end space-x-2 sm:space-x-4 h-56">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                             <div
                                className="w-full bg-gray-700/50 rounded-t-md relative transition-all duration-300 group-hover:bg-gray-700"
                                style={{ height: '100%' }}
                            >
                                <div
                                    className={`${item.color} w-full rounded-t-md absolute bottom-0`}
                                    style={{ height: `${(item.value / maxValue) * 100}%`, transition: 'height 1s ease-out' }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.value}</span>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 mt-2 text-center">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BarChart;