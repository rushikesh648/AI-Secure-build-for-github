import type { Commit } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export const fetchRepoCommits = async (repoName: string): Promise<Commit[]> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${repoName}/commits`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Repository "${repoName}" not found.`);
            }
            if (response.status === 403) {
                const rateLimitReset = response.headers.get('X-RateLimit-Reset');
                let message = 'GitHub API rate limit exceeded.';
                if (rateLimitReset) {
                    const resetTime = new Date(parseInt(rateLimitReset, 10) * 1000);
                    message += ` Please try again after ${resetTime.toLocaleTimeString()}.`;
                }
                throw new Error(message);
            }
            throw new Error(`Failed to fetch commits: ${response.statusText} (status ${response.status})`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            if (data.message) {
                console.warn(`Could not fetch commits for ${repoName}: ${data.message}`);
                return [];
            }
            throw new Error('Unexpected response format from GitHub API for commits.');
        }

        return data.map((item: any) => ({
            sha: item.sha,
            author: item.commit.author.name,
            date: item.commit.author.date,
            message: item.commit.message,
        }));
    } catch (error) {
        console.error('Error fetching commits from GitHub:', error);
        throw error;
    }
};
