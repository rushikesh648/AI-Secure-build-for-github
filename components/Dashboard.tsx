import React from 'react';
import type { AnalysisResult, PipelineStep, Commit } from '../types';
import { PipelineVisualizer } from './PipelineVisualizer';
import { VulnerabilityList } from './VulnerabilityList';
import { AiInsights } from './AiInsights';
import { SeverityChart } from './SeverityChart';
import { CommitHistory } from './CommitHistory';
import { InteractiveDeploy } from './InteractiveDeploy';

interface DashboardProps {
    isScanning: boolean;
    pipelineState: PipelineStep[];
    analysisResult: AnalysisResult | null;
    aiInsight: string;
    commits: Commit[];
    dateFilter: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ isScanning, pipelineState, analysisResult, aiInsight, commits, dateFilter }) => {
    const showDashboard = isScanning || analysisResult;

    if (!showDashboard) {
        return null;
    }

    return (
        <div className="mt-12 space-y-8">
            <div className="bg-brand-secondary border border-border-color rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-white">Build Pipeline</h3>
                <PipelineVisualizer steps={pipelineState} />
            </div>

            {analysisResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-brand-secondary border border-border-color rounded-lg p-6 shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-white">AI Security Insights</h3>
                         <AiInsights insight={aiInsight} />
                    </div>
                     <div className="bg-brand-secondary border border-border-color rounded-lg p-6 shadow-md flex flex-col items-center justify-center">
                        <h3 className="text-xl font-bold mb-4 text-white">Vulnerability Severity</h3>
                        <SeverityChart summary={analysisResult.summary} />
                    </div>
                </div>
            )}
            
            {analysisResult && (
                <div className="bg-brand-secondary border border-border-color rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-white">Vulnerabilities Found ({analysisResult.summary.total})</h3>
                    <VulnerabilityList vulnerabilities={analysisResult.vulnerabilities} />
                </div>
            )}

            {analysisResult && (
                 <div className="bg-brand-secondary border border-border-color rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-white">Interactive Deployment</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Trigger a simulated deployment to production using the keyboard shortcut below.
                    </p>
                    <InteractiveDeploy />
                </div>
            )}

            {analysisResult && commits.length > 0 && (
                <div className="bg-brand-secondary border border-border-color rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-white">Commit History</h3>
                    <CommitHistory commits={commits} dateRange={dateFilter} />
                </div>
            )}
        </div>
    );
};