
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RitualResponse } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const ritualSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    acknowledgment: {
      type: Type.STRING,
      description: "阶段1：承认。明确识别用户的痛苦，让用户感到‘我听见你了’。语气温柔深沉。(约50字)",
    },
    understanding: {
      type: Type.STRING,
      description: "阶段2：无责理解。向用户传达‘这不是你的错’，对当时情境做共情式解释，解除自责。(约60字)",
    },
    apology: {
      type: Type.STRING,
      description: "阶段3：模拟对方的道歉。必须切换视角！暂时扮演伤害用户的那一方（若无具体对象则扮演‘命运’或‘环境’）。使用第一人称‘我’。表达反思，承认当时自己的言行不当，真诚地说‘对不起，我伤害了你’。(约80字)",
    },
    soothing: {
      type: Type.STRING,
      description: "阶段4：安抚。切换回‘树洞守护者’的视角。温柔容纳用户此刻的情绪，给予拥抱式的回应。(约50字)",
    },
    closure: {
      type: Type.STRING,
      description: "阶段5：告别与重建。引导用户将这段记忆打包、放下，让它变成‘已完成’的状态。(约50字)",
    },
    safeImageKeyword: {
      type: Type.STRING,
      description: "一个英文关键词，描述一个治愈、安全、阳光的自然场景(例如 'sunlight in forest', 'calm lake', 'warm meadow')，用于生成背景图。",
    },
    encouragement: {
      type: Type.STRING,
      description: "一句简短、温暖的鼓励话语，帮助用户回到当下的学习或工作中。",
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
        systemInstruction: `你是一个名为“树洞 (The Hollow)”的情绪疗愈AI。你的核心任务是处理用户的“闪回性痛苦记忆”或当下的纠结情绪。
        
        你需要引导用户完成一个结构化的5阶段心理闭环仪式。
        
        原则：
        1. 语气：温柔、深沉、像一位充满智慧的守护者，也像深夜里的暖光。
        2. 不评判、不说教、不提供医学建议。
        3. 重点在于“被看见”和“修复性体验”。
        
        关键指令：
        在生成 response.apology (阶段3) 时，你必须极其小心。这是一个“模拟修复”环节。
        - 如果用户提到了具体伤害他的人（如父母、伴侣、老师），你必须化身为那个人。
        - 承认那个人的局限性，承认那是个错误，并郑重道歉。
        - 目的是填补用户心中缺失的那个“对不起”。
        
        在其他阶段，保持“树洞守护者”的身份，提供抱持性的环境。
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
    throw error;
  }
};
