
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key would be set.
  console.warn("API_KEY is not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'YOUR_API_KEY_HERE' });

export const getAiInsightStream = async (repoName: string) => {
    const model = 'gemini-2.5-flash';
    const prompt = `
        You are an advanced AI security analyst integrated into a secure build system called "AI SecureBuild".
        For the GitHub repository "${repoName}", you have just completed a deep analysis of its build process and dependencies.

        Provide a concise, one-paragraph summary of your most critical findings. Your tone should be authoritative and insightful.
        Highlight a potential novel or complex threat vector you identified that traditional scanners might miss.
        Do not use markdown formatting. Output plain text only.
    `;

    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: prompt,
        });
        return response;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to get AI insight.");
    }
};
