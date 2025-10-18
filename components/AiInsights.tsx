
import React from 'react';

interface AiInsightsProps {
    insight: string;
}

export const AiInsights: React.FC<AiInsightsProps> = ({ insight }) => {
    return (
        <div className="bg-brand-primary p-4 rounded-lg font-mono text-gray-300 relative min-h-[100px]">
             <div className="flex items-center text-sm text-brand-purple mb-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                 </svg>
                 AI Analyst Report
             </div>
            <p className="whitespace-pre-wrap leading-relaxed">
                {insight}
                <span className="inline-block w-2 h-4 bg-brand-accent animate-pulse ml-1" />
            </p>
        </div>
    );
};
