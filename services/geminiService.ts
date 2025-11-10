import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In the target environment, the key is expected to be present.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'MISSING_API_KEY' });
const model = 'gemini-2.5-flash-image';

export const generateImageFromImageAndText = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in the Gemini response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

export const generateImageVariations = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  count: number = 3
): Promise<string[]> => {
  const promises = Array.from({ length: count }, () => 
    generateImageFromImageAndText(base64Image, mimeType, prompt)
  );

  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error generating image variations:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image variations: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating image variations.");
  }
};
