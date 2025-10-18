export enum PipelineStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export enum DeploymentStatus {
    READY = 'READY',
    AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
    DEPLOYING = 'DEPLOYING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export interface PipelineStep {
    id: string;
    name: string;
    status: PipelineStatus;
}

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Vulnerability {
    id: string;
    title: string;
    severity: Severity;
    description: string;
    file: string;
    line: number;
    recommendation: string;
}

export interface AnalysisResult {
    repoName: string;
    vulnerabilities: Vulnerability[];
    summary: {
        total: number;
        severities: Record<Severity, number>;
    };
}

export interface Commit {
    sha: string;
    author: string;
    date: string;
    message: string;
}