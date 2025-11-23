import { GoogleGenAI, Type } from "@google/genai";
import { StockMetadata } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateStockMetadata = async (file: File): Promise<StockMetadata> => {
  try {
    const base64Data = await fileToGenerativePart(file);

    // Define the output schema for structured JSON response
    const schema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A concise, commercially viable title for the image (max 10 words). English language.",
        },
        description: {
          type: Type.STRING,
          description: "A detailed description of the image including action, subject, and mood. English language.",
        },
        keywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "A list of 40-50 highly relevant, high-ranking keywords/tags for microstock SEO. Sorted by relevance. English language.",
        },
        category: {
          type: Type.STRING,
          description: "The most suitable category (e.g., Business, Nature, Technology, Lifestyle).",
        }
      },
      required: ["title", "description", "keywords", "category"],
    };

    const model = "gemini-2.5-flash";
    
    const prompt = `
      Act as a professional Microstock Keywording Expert (Shutterstock, Adobe Stock, Getty Images). 
      Analyze the uploaded image and generate metadata optimized for high sales and searchability.
      
      Rules:
      1. All output MUST be in English (Standard for Microstock).
      2. Keywords should include singular and plural forms where relevant, concepts, emotions, and descriptive terms.
      3. The title should be catchy and descriptive.
      4. Avoid trademarked names or restricted brands.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, // Lower temperature for more precise/factual tags
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as StockMetadata;
    return data;

  } catch (error) {
    console.error("Error generating metadata:", error);
    throw error;
  }
};