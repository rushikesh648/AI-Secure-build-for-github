
import React from 'react';
import type { PipelineStep } from '../types';
import { PipelineStatus } from '../types';

const StatusIcon: React.FC<{ status: PipelineStatus }> = ({ status }) => {
    switch (status) {
        case PipelineStatus.SUCCESS:
            return (
                <div className="h-8 w-8 rounded-full bg-brand-green flex items-center justify-center ring-4 ring-green-500/30">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            );
        case PipelineStatus.RUNNING:
            return (
                <div className="h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center ring-4 ring-blue-500/30">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            );
        case PipelineStatus.PENDING:
        default:
            return (
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center ring-4 ring-gray-500/30">
                    <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
    }
};

export const PipelineVisualizer: React.FC<{ steps: PipelineStep[] }> = ({ steps }) => {
    return (
        <div className="flex flex-col space-y-4">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4">
                    <StatusIcon status={step.status} />
                    <span className={`font-medium ${step.status === PipelineStatus.RUNNING ? 'text-brand-accent' : step.status === PipelineStatus.SUCCESS ? 'text-gray-300' : 'text-gray-500'}`}>
                        {step.name}
                    </span>
                </div>
            ))}
        </div>
    );
};
