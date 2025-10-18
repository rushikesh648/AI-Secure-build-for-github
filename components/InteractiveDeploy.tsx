import React, { useState, useEffect, useCallback } from 'react';
import { DeploymentStatus } from '../types';

const CheckIcon = () => (
    <svg className="h-12 w-12 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XIcon = () => (
     <svg className="h-12 w-12 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Spinner = () => (
    <svg className="animate-spin h-12 w-12 text-brand-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const KeyIndicator: React.FC<{ char: string; active: boolean }> = ({ char, active }) => (
    <kbd className={`px-3 py-1.5 text-lg font-mono font-bold border-b-4 rounded-md shadow-inner transition-all duration-150 ${
        active 
        ? 'bg-brand-accent text-white border-blue-700 transform -translate-y-0.5' 
        : 'bg-brand-primary text-gray-400 border-gray-900'
    }`}>
        {char}
    </kbd>
);

export const InteractiveDeploy: React.FC = () => {
    const [status, setStatus] = useState<DeploymentStatus>(DeploymentStatus.READY);

    const reset = useCallback(() => {
        setStatus(DeploymentStatus.READY);
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Prevent interfering with input fields
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
            return;
        }

        const key = event.key.toLowerCase();

        switch (status) {
            case DeploymentStatus.READY:
                if (key === 'd') {
                    event.preventDefault();
                    setStatus(DeploymentStatus.AWAITING_CONFIRMATION);
                }
                break;
            case DeploymentStatus.AWAITING_CONFIRMATION:
                event.preventDefault();
                if (key === 'e') {
                    setStatus(DeploymentStatus.DEPLOYING);
                    // Simulate deployment
                    setTimeout(() => {
                        // Randomly succeed or fail (80% success rate)
                        setStatus(Math.random() > 0.2 ? DeploymentStatus.SUCCESS : DeploymentStatus.FAILURE);
                    }, 2500);
                } else if (key !== 'd') { // allow pressing 'd' again without reset
                    reset();
                }
                break;
            case DeploymentStatus.SUCCESS:
            case DeploymentStatus.FAILURE:
                // Any key resets after deployment attempt
                event.preventDefault();
                reset();
                break;
            default:
                break;
        }
    }, [status, reset]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Timeout for awaiting confirmation
    useEffect(() => {
        if (status === DeploymentStatus.AWAITING_CONFIRMATION) {
            const timer = setTimeout(() => {
                reset();
            }, 3000); // 3 seconds to press 'e'
            return () => clearTimeout(timer);
        }
    }, [status, reset]);

    const renderContent = () => {
        switch (status) {
            case DeploymentStatus.DEPLOYING:
                return (
                    <>
                        <Spinner />
                        <p className="mt-4 text-lg font-semibold text-gray-300">Deploying to Production...</p>
                    </>
                );
            case DeploymentStatus.SUCCESS:
                return (
                    <>
                        <CheckIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-green">Deployment Successful!</p>
                        <p className="text-xs text-gray-500 mt-2">Press any key to reset.</p>
                    </>
                );
            case DeploymentStatus.FAILURE:
                 return (
                    <>
                        <XIcon />
                        <p className="mt-4 text-lg font-semibold text-brand-red">Deployment Failed</p>
                        <p className="text-sm text-gray-400">Simulated rollback initiated.</p>
                        <p className="text-xs text-gray-500 mt-2">Press any key to reset.</p>
                    </>
                );
            case DeploymentStatus.READY:
            case DeploymentStatus.AWAITING_CONFIRMATION:
            default:
                return (
                    <>
                        <p className="text-gray-300 mb-4 text-lg">
                            {status === DeploymentStatus.READY ? "Ready to Deploy" : "Confirm Deployment"}
                        </p>
                        <div className="flex items-center space-x-4">
                            <KeyIndicator char="D" active={status === DeploymentStatus.AWAITING_CONFIRMATION} />
                            <KeyIndicator char="E" active={false} />
                        </div>
                        <p className="text-xs text-gray-500 mt-4 h-4">
                            {status === DeploymentStatus.AWAITING_CONFIRMATION && "Sequence will time out in 3 seconds..."}
                        </p>
                    </>
                );
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-brand-primary rounded-lg min-h-[160px] text-center border border-border-color">
            {renderContent()}
        </div>
    );
};