import { GoogleGenAI } from "@google/genai";

// Lazy-initialized AI client to prevent crashes if key is missing on startup
let aiClient: GoogleGenAI | null = null;

export const getAI = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it via the Secrets panel.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const MODEL_NAME = "gemini-3-flash-preview";
export const IMAGE_MODEL = "gemini-2.5-flash-image";
