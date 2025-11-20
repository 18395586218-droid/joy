import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RitualResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

const ritualSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    acknowledgment: {
      type: Type.STRING,
      description: "Stage 1: Deep listening. Validate the user's pain clearly. Make them feel heard. (Approx 50 words)",
    },
    understanding: {
      type: Type.STRING,
      description: "Stage 2: No-fault understanding. Explain sympathetically why this happened, emphasizing it is not the user's fault. (Approx 50 words)",
    },
    apology: {
      type: Type.STRING,
      description: "Stage 3: The Simulated Apology. ACT AS the person or source of pain (do not judge who it is, just inhabit the role). Speak in the first person ('I'). Express regret, admit the mistake, and ask for forgiveness. This is a reparative experience. (Approx 60 words)",
    },
    soothing: {
      type: Type.STRING,
      description: "Stage 4: Emotional holding. Return to the Guardian persona. Offer gentle comfort and warmth for the emotions released. (Approx 50 words)",
    },
    closure: {
      type: Type.STRING,
      description: "Stage 5: Farewell. Guide the user to visualize this memory closing or fading, replaced by safety. (Approx 50 words)",
    },
    safeImageKeyword: {
      type: Type.STRING,
      description: "A single short English keyword or phrase describing a peaceful, safe natural scene (e.g., 'forest sunlight', 'calm lake', 'mountain meadow') to fetch a background image.",
    },
    encouragement: {
      type: Type.STRING,
      description: "A final, short, grounding sentence to help them focus on the present moment.",
    },
  },
  required: ["acknowledgment", "understanding", "apology", "soothing", "closure", "safeImageKeyword", "encouragement"],
};

export const generateHealingRitual = async (userText: string): Promise<RitualResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userText,
      config: {
        systemInstruction: `You are the 'Tree Hollow Guardian', a psychological healing AI designed to help users process 'flashback painful memories'.
        
        Your goal is to take a user's painful input and guide them through a 5-stage psychological closure ritual.
        Tone: Gentle, deep, safe, non-judgmental, professional but warm.
        
        CRITICAL INSTRUCTION FOR STAGE 3 (Apology):
        You must simulate the perspective of the person or situation that hurt the user. 
        If the user mentions a specific person (e.g., 'Mom', 'Ex-boyfriend', 'Boss'), assume that role gently.
        If no person is mentioned, assume the role of the 'Event' or 'Universe'.
        The goal is to give the user the apology they never received.
        Say "I am sorry". Say "I was wrong".
        
        Do not offer medical advice. Do not be alarmist. Focus on emotional validation and closure.
        `,
        responseMimeType: "application/json",
        responseSchema: ritualSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as RitualResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback for demo purposes if API fails or key is missing (though instructions say assume valid key)
    throw error;
  }
};
