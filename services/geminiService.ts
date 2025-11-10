import { supabase } from '../lib/supabaseClient';

const handleSupabaseError = (error: any, functionName: string) => {
  console.error(`Error calling Supabase function '${functionName}':`, error);
  if (error.message) {
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.error) {
        throw new Error(parsedError.error);
      }
    } catch (e) {
      // Not a JSON error, throw the original message
    }
  }
  throw new Error(`Failed to generate image: ${error.message || 'An unknown error occurred.'}`);
}

interface GeneratedImageResponse {
  base64Image: string;
  imageId: string;
}

interface VariationResponse {
  base64Image: string;
  imageId: string;
}

export const generateImageFromImageAndText = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<GeneratedImageResponse> => {
  const { data, error } = await supabase.functions.invoke('generate-image', {
    body: { base64Image, mimeType, prompt },
  });

  if (error) {
    handleSupabaseError(error, 'generate-image');
  }

  if (data && data.base64Image && data.imageId) {
    return data;
  }
  
  throw new Error("Invalid response from the server.");
};

export const generateImageVariations = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  count: number = 3
): Promise<VariationResponse[]> => {
  const { data, error } = await supabase.functions.invoke('generate-image-variations', {
    body: { base64Image, mimeType, prompt, count },
  });

  if (error) {
    handleSupabaseError(error, 'generate-image-variations');
  }

  if (data && Array.isArray(data.variations)) {
    return data.variations;
  }

  throw new Error("Invalid variations response from the server.");
};

export const createCheckoutSession = async (imageId: string): Promise<{ url: string }> => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { imageId },
  });

  if (error) {
    handleSupabaseError(error, 'create-checkout-session');
  }
  
  if (data && data.url) {
    return data;
  }

  throw new Error("Failed to create checkout session.");
}