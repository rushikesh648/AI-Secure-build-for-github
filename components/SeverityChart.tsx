
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { AnalysisResult } from '../types';

interface SeverityChartProps {
    summary: AnalysisResult['summary'];
}

const SEVERITY_ORDER: (keyof AnalysisResult['summary']['severities'])[] = ['Critical', 'High', 'Medium', 'Low'];

const COLORS: Record<keyof AnalysisResult['summary']['severities'], string> = {
    Critical: '#DA3633', // brand-red
    High: '#F0883E', // brand-orange
    Medium: '#eab308', // yellow-500
    Low: '#58A6FF', // brand-accent
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-col space-y-1 mt-4">
      {
        payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center text-sm">
            <span className="w-3 h-3 mr-2" style={{backgroundColor: entry.color}} />
            <span className="text-gray-400">{entry.value}:</span>
            <span className="font-bold text-white ml-1">{entry.payload.value}</span>
          </li>
        ))
      }
    </ul>
  );
};

export const SeverityChart: React.FC<SeverityChartProps> = ({ summary }) => {
    const data = SEVERITY_ORDER
        .filter(severity => summary.severities[severity] > 0)
        .map(severity => ({
            name: severity,
            value: summary.severities[severity],
        }));

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                    </Pie>
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
