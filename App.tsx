import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { RepoInput } from './components/RepoInput';
import { Dashboard } from './components/Dashboard';
import { getAiInsightStream } from './services/geminiService';
import { fetchRepoCommits } from './services/githubService';
import type { AnalysisResult, Vulnerability, PipelineStep, Commit } from './types';
import { PipelineStatus } from './types';
import { MOCK_VULNERABILITIES, PIPELINE_STEPS } from './constants';
import { FilterControls } from './components/FilterControls';

const App: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [aiInsight, setAiInsight] = useState<string>('');
    const [pipelineState, setPipelineState] = useState<PipelineStep[]>(PIPELINE_STEPS);
    const [commits, setCommits] = useState<Commit[]>([]);
    const [languageFilter, setLanguageFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');

    const clearFilters = useCallback(() => {
        setLanguageFilter('');
        setDateFilter('');
    }, []);

    const runAiAnalysis = async (repoName: string) => {
        setAiInsight('');
        try {
            const stream = await getAiInsightStream(repoName);
            for await (const chunk of stream) {
                setAiInsight(prev => prev + chunk.text);
            }
        } catch (err) {
            console.error("AI analysis failed:", err);
            setAiInsight("An error occurred while generating AI insights.");
        }
    };

    const handleScan = useCallback(async () => {
        if (!repoUrl) {
            setError('Please enter a GitHub repository URL.');
            return;
        }
        
        const repoNameMatch = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
        if (!repoNameMatch) {
            setError('Invalid GitHub URL format. Use format like: https://github.com/owner/repo');
            return;
        }
        
        const repoName = repoNameMatch[1];
        setError(null);
        setIsScanning(true);
        setAnalysisResult(null);
        setAiInsight('');
        setCommits([]);
        setPipelineState(PIPELINE_STEPS.map(step => ({ ...step, status: PipelineStatus.PENDING })));

        const runPipeline = async () => {
            for (let i = 0; i < PIPELINE_STEPS.length; i++) {
                setPipelineState(prev => prev.map((step, index) => index === i ? { ...step, status: PipelineStatus.RUNNING } : step));
                
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

                if (PIPELINE_STEPS[i].id === 'ai-threat-scan') {
                    await runAiAnalysis(repoName);
                }

                setPipelineState(prev => prev.map((step, index) => index === i ? { ...step, status: PipelineStatus.SUCCESS } : step));
            }

            const severities = MOCK_VULNERABILITIES.reduce((acc, v) => {
                acc[v.severity] = (acc[v.severity] || 0) + 1;
                return acc;
            }, {} as Record<Vulnerability['severity'], number>);
            
            setAnalysisResult({
                repoName,
                vulnerabilities: MOCK_VULNERABILITIES,
                summary: {
                    total: MOCK_VULNERABILITIES.length,
                    severities,
                },
            });
            setIsScanning(false);
        };

        try {
            const cachedCommits = localStorage.getItem(`commits_${repoName}`);
            let commitData: Commit[];
            if (cachedCommits) {
                commitData = JSON.parse(cachedCommits);
            } else {
                commitData = await fetchRepoCommits(repoName);
                localStorage.setItem(`commits_${repoName}`, JSON.stringify(commitData));
            }
            setCommits(commitData);
            runPipeline();
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            setIsScanning(false);
        }
    }, [repoUrl]);

    return (
        <div className="min-h-screen bg-brand-primary font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-100 mb-2">
                        Secure Your Build Pipeline with AI
                    </h2>
                    <p className="text-center text-gray-400 mb-8">
                        Enter a public GitHub repository to simulate a security scan and get AI-driven insights.
                    </p>
                    <RepoInput
                        repoUrl={repoUrl}
                        setRepoUrl={setRepoUrl}
                        onScan={handleScan}
                        isScanning={isScanning}
                    />
                    <FilterControls
                        language={languageFilter}
                        setLanguage={setLanguageFilter}
                        dateRange={dateFilter}
                        setDateRange={setDateFilter}
                        clearFilters={clearFilters}
                    />
                    {error && <p className="text-center text-brand-red mt-4">{error}</p>}
                    
                    <Dashboard
                        isScanning={isScanning}
                        pipelineState={pipelineState}
                        analysisResult={analysisResult}
                        aiInsight={aiInsight}
                        commits={commits}
                        dateFilter={dateFilter}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;