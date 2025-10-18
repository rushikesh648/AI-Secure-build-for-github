
import type { Vulnerability, PipelineStep } from './types';
import { PipelineStatus } from './types';

export const PIPELINE_STEPS: PipelineStep[] = [
    { id: 'clone-repo', name: 'Clone Repository', status: PipelineStatus.PENDING },
    { id: 'install-deps', name: 'Install Dependencies', status: PipelineStatus.PENDING },
    { id: 'static-analysis', name: 'Static Code Analysis (SAST)', status: PipelineStatus.PENDING },
    { id: 'dependency-scan', name: 'Dependency Vulnerability Scan', status: PipelineStatus.PENDING },
    { id: 'ai-threat-scan', name: 'AI Threat Intelligence Scan', status: PipelineStatus.PENDING },
    { id: 'build-project', name: 'Build Project', status: PipelineStatus.PENDING },
    { id: 'finalize', name: 'Finalize Report', status: PipelineStatus.PENDING },
];

export const MOCK_VULNERABILITIES: Vulnerability[] = [
    {
        id: 'CVE-2023-12345',
        title: 'Remote Code Execution in `node-ipc`',
        severity: 'Critical',
        description: 'A malicious package in the dependency tree allows for remote code execution.',
        file: 'package-lock.json',
        line: 452,
        recommendation: 'Update `node-ipc` to version 10.1.3 or higher. Run `npm audit fix --force`.',
    },
    {
        id: 'CVE-2023-67890',
        title: 'Cross-Site Scripting (XSS) in `react-dom`',
        severity: 'High',
        description: 'A vulnerability in an older version of React DOM could allow an attacker to inject malicious scripts.',
        file: 'src/components/UserInput.tsx',
        line: 88,
        recommendation: 'Upgrade React and React DOM to the latest version (18.2.0 or higher). Sanitize user inputs.',
    },
    {
        id: 'GHSA-abcd-efgh-ijkl',
        title: 'Insecure JWT Signing Algorithm',
        severity: 'High',
        description: 'The JWT signing process uses a weak algorithm (`HS256`) with a hardcoded secret.',
        file: 'src/services/auth.ts',
        line: 25,
        recommendation: 'Use a strong asymmetric algorithm like `RS256` and manage secrets securely using environment variables or a secrets manager.',
    },
    {
        id: 'CWE-352',
        title: 'Cross-Site Request Forgery (CSRF)',
        severity: 'Medium',
        description: 'The application form submission endpoint lacks CSRF protection, making it vulnerable to forged requests.',
        file: 'server/routes/api.js',
        line: 112,
        recommendation: 'Implement anti-CSRF tokens for all state-changing requests.',
    },
    {
        id: 'CWE-798',
        title: 'Use of Hard-coded Credentials',
        severity: 'Medium',
        description: 'A database password is hard-coded directly in a configuration file.',
        file: 'config/database.js',
        line: 12,
        recommendation: 'Externalize credentials from the codebase. Use environment variables or a secret management service.',
    },
    {
        id: 'CWE-22',
        title: 'Path Traversal Vulnerability',
        severity: 'Low',
        description: 'User-supplied filename is not properly sanitized, potentially allowing access to arbitrary files on the server.',
        file: 'server/controllers/fileController.js',
        line: 42,
        recommendation: 'Sanitize and validate all user-provided file paths to prevent directory traversal.',
    },
];
