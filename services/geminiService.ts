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
      // Not a JSON error, ignore
    }
  }
  throw new Error(`Failed to execute '${functionName}': ${error.message || 'Unknown error.'}`);
};

interface GeneratedImageResponse {
  base64Image: string;
  imageId: string;
}

interface VariationResponse {
  base64Image: string;
  imageId: string;
}

export interface PurchasedImage {
  id: string;
  base64_image: string;
  created_at: string;
}

export interface UserImage {
  id: string;
  image_url: string;
}

export const generateImageFromImageAndText = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<GeneratedImageResponse> => {
  const { data, error } = await supabase.functions.invoke('generate-image', {
    body: { base64Image, mimeType, prompt },
  });

  if (error) handleSupabaseError(error, 'generate-image');

  if (data && data.base64Image && data.imageId) return data;

  throw new Error("Invalid response from generate-image function.");
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

  if (error) handleSupabaseError(error, 'generate-image-variations');

  if (data && Array.isArray(data.variations)) return data.variations;

  throw new Error("Invalid variations response.");
};

export const createCheckoutSession = async (imageId: string): Promise<{ url: string }> => {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { imageId },
  });

  if (error) handleSupabaseError(error, 'create-checkout-session');

  if (data && data.url) return data;

  throw new Error("Failed to create checkout session.");
};

export const confirmPurchase = async (imageId: string, sessionId: string): Promise<{ success: boolean }> => {
  const { data, error } = await supabase.functions.invoke('confirm-purchase', {
    body: { imageId, sessionId },
  });

  if (error) handleSupabaseError(error, 'confirm-purchase');

  if (data && data.success) return data;

  throw new Error("Failed to confirm purchase.");
};

/**
 * ✅ Busca imagens pagas do usuário (URLs públicas)
 */
export const getMyCreations = async (): Promise<UserImage[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-my-creations');

    if (error) {
      console.warn("⚠️ get-my-creations error:", error.message);
      return [];
    }

    if (data && Array.isArray(data.images)) {
      return data.images.map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
      }));
    }

    return [];
  } catch (err: any) {
    console.error("❌ Erro em getMyCreations:", err.message);
    return [];
  }
};
