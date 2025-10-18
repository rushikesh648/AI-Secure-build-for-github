import React, { useState, useMemo } from 'react';
import type { Commit } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CommitHistoryProps {
    commits: Commit[];
    dateRange: string;
}

const dateToTime = (dateStr: string): number => new Date(dateStr).getTime();

const applyDateFilter = (commits: Commit[], dateRange: string): Commit[] => {
    if (!dateRange) return commits;

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    let threshold: number;

    switch (dateRange) {
        case 'Last 24 hours':
            threshold = now - oneDay;
            break;
        case 'Last 7 days':
            threshold = now - 7 * oneDay;
            break;
        case 'Last 30 days':
            threshold = now - 30 * oneDay;
            break;
        default:
            return commits;
    }

    return commits.filter(commit => dateToTime(commit.date) > threshold);
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-primary p-2 border border-border-color rounded-md shadow-lg">
          <p className="font-bold text-gray-200">{label}</p>
          <p className="text-brand-accent">{`Commits: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

export const CommitHistory: React.FC<CommitHistoryProps> = ({ commits, dateRange }) => {
    const [authorFilter, setAuthorFilter] = useState('');
    const [messageFilter, setMessageFilter] = useState('');

    const filteredCommits = useMemo(() => {
        let result = commits;

        result = applyDateFilter(result, dateRange);

        if (authorFilter) {
            result = result.filter(commit =>
                commit.author.toLowerCase().includes(authorFilter.toLowerCase())
            );
        }

        if (messageFilter) {
            result = result.filter(commit =>
                commit.message.toLowerCase().includes(messageFilter.toLowerCase())
            );
        }

        return result;
    }, [commits, dateRange, authorFilter, messageFilter]);

    const authorCommitData = useMemo(() => {
        const counts = filteredCommits.reduce((acc, commit) => {
            acc[commit.author] = (acc[commit.author] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([author, commits]) => ({ author, commits }))
            .sort((a, b) => b.commits - a.commits);
    }, [filteredCommits]);

    return (
        <div>
            {authorCommitData.length > 1 && (
                <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-200 mb-4">Commits per Author</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <BarChart data={authorCommitData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                                <XAxis 
                                    dataKey="author" 
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                                    stroke="#30363D"
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis 
                                    allowDecimals={false} 
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                                    stroke="#30363D"
                                />
                                <Tooltip cursor={{ fill: 'rgba(88, 166, 255, 0.1)' }} content={<CustomTooltip />} />
                                <Bar dataKey="commits" fill="#58A6FF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    placeholder="Filter by author..."
                    className="w-full bg-brand-primary border border-border-color text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                />
                <input
                    type="text"
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value)}
                    placeholder="Filter by message..."
                    className="w-full bg-brand-primary border border-border-color text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                />
            </div>
            
            <div className="max-h-96 overflow-y-auto pr-2">
                {filteredCommits.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredCommits.map(commit => (
                            <li key={commit.sha} className="bg-brand-primary p-3 rounded-md border border-border-color">
                                <p className="font-mono text-sm text-gray-100 truncate" title={commit.message}>
                                    {commit.message.split('\n')[0]}
                                </p>
                                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                    <span className="font-semibold">{commit.author}</span>
                                    <span>{new Date(commit.date).toLocaleDateString()}</span>
                                    <a 
                                        href={`#`}
                                        className="font-mono text-brand-accent hover:underline"
                                        title={commit.sha}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {commit.sha.substring(0, 7)}
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">No commits match the current filters.</p>
                )}
            </div>
        </div>
    );
};