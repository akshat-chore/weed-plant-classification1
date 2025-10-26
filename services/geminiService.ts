
import { GoogleGenAI, Type } from "@google/genai";
import type { WeedClassification } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const classificationSchema = {
  type: Type.OBJECT,
  properties: {
    class: {
      type: Type.STRING,
      description: "The scientific or common name of the plant species."
    },
    is_weed: {
      type: Type.BOOLEAN,
      description: "A boolean indicating if the plant is considered a weed."
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score from 0.0 to 1.0 for the classification."
    },
    description: {
      type: Type.STRING,
      description: "A detailed description of the plant, including its key identifying characteristics."
    },
    severity_level: {
      type: Type.STRING,
      description: "A severity level ('Low', 'Medium', 'High', 'None') based on its potential harm to crops or gardens."
    },
    recommended_actions: {
      type: Type.STRING,
      description: "Actionable advice for management or removal if it's a harmful weed. Provide control methods (mechanical, cultural, chemical)."
    },
  },
  required: ['class', 'is_weed', 'confidence', 'description', 'severity_level', 'recommended_actions'],
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const classifyWeed = async (imageFile: File): Promise<WeedClassification> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = {
      text: "Analyze the plant in this image and provide a detailed classification. Identify if it's a weed and provide management advice."
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: "You are an expert botanist and agronomist specializing in weed identification and control. Respond ONLY with a valid JSON object that adheres to the provided schema. If the image does not clearly show a plant, return an error within the JSON structure.",
        responseMimeType: "application/json",
        responseSchema: classificationSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as WeedClassification;
    return parsedResult;
  } catch (error) {
    console.error("Error classifying weed:", error);
    throw new Error("Failed to get a valid classification from the AI model. Please try again with a clearer image.");
  }
};
