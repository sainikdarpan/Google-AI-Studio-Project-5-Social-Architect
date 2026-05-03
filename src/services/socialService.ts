import { GoogleGenAI, Type } from "@google/genai";
import { getAI, MODEL_NAME } from "./ai";

export async function generateCampaign(holiday: string, brand: string, audience: string) {
  const ai = getAI();
  
  const prompt = `Generate a social media campaign for ${holiday}.
    Brand: ${brand}
    Target Audience: ${audience}
    
    Provide 5 unique campaign ideas. Each idea must include:
    - theme (short title)
    - hook (engaging first line)
    - caption (full post body with emojis)
    - visualPrompt (detailed prompt for an AI image generator)
    - platform (the most suitable social media platform for this concept).
    
    The tone should be professional yet creative and optimized for high engagement.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                hook: { type: Type.STRING },
                caption: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
                platform: { type: Type.STRING }
              },
              required: ["theme", "hook", "caption", "visualPrompt", "platform"]
            }
          }
        },
        required: ["ideas"]
      }
    }
  });

  return JSON.parse(response.text).ideas;
}

export async function generateBaseContent(topic: string, goal: string = "engagement", length: string = "medium", keywords?: { include?: string[], exclude?: string[] }) {
  const ai = getAI();
  const prompt = `Act as a senior social media strategist. Generate a high-impact, versatile base content piece about the following topic.
    Topic: "${topic}"
    Primary Goal: ${goal}
    Length: ${length}
    ${keywords?.include?.length ? `Keywords to INCLUDE: ${keywords.include.join(', ')}` : ''}
    ${keywords?.exclude?.length ? `Keywords to STRICTLY EXCLUDE: ${keywords.exclude.join(', ')}` : ''}
    
    The content should be a "master asset" that can be easily adapted to different platforms. 
    It should include a strong hook, key value proposition, and a clear call to action.
    Format the response as plain text without any markdown or conversational filler.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [{ text: prompt }]
    }
  });

  return response.text;
}

export async function getInspirationFeed() {
  const ai = getAI();
  const prompt = `Generate 6 trending social media visual concepts for high-end lifestyle, architecture, and technology brands.
    For each concept, provide:
    1. A catchy Title
    2. A detailed Visual Prompt (for an AI image generator)
    3. The "Platform" where this would perform best.
    
    Return the data as a JSON array of objects with keys: title, prompt, platform.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    config: { responseMimeType: "application/json" },
    contents: {
      parts: [{ text: prompt }]
    }
  });

  return JSON.parse(response.text);
}

export async function transformCaption(caption: string, platforms: string[], tone: string = "professional", length: string = "original", keywords?: { include?: string[], exclude?: string[] }) {
  const ai = getAI();
  const prompt = `Rewrite this social media caption for the following platforms: ${platforms.join(', ')}.
    Original Caption: "${caption}"
    Desired Tone: ${tone}
    Target Length: ${length}
    ${keywords?.include?.length ? `Keywords to INCLUDE: ${keywords.include.join(', ')}` : ''}
    ${keywords?.exclude?.length ? `Keywords to STRICTLY EXCLUDE: ${keywords.exclude.join(', ')}` : ''}
    
    Return a JSON object where keys are the platform names and values are the re-written captions.
    Ensure each version follows platform best practices (e.g., hashtags for Instagram, professional for LinkedIn, punchy for X) while strictly adhering to the requested tone (${tone}) and length constraints.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}

export async function generatePostImage(prompt: string, aspectRatio: string = "1:1", style: string = "photorealistic", quality: string = "standard", isVideo: boolean = false) {
  const ai = getAI();
  const type = isVideo ? "video" : "image";
  const response = await ai.models.generateContent({
    model: isVideo ? "gemini-2.0-flash-exp" : "gemini-2.5-flash-image", // Use flash-exp for video generation simulations
    contents: {
      parts: [{ text: `High quality social media post ${type}. Quality focus: ${quality}. Style: ${style}. Aspect Ratio: ${aspectRatio}. Subject: ${prompt}. ${isVideo ? 'Generate a short 5-10 second cinematic motion clip.' : ''} Include a subtle "Social Architect" architectural logo watermark in the bottom right corner.` }]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error(`No ${type} generated`);
}
