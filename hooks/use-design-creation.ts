"use client";

import { useState } from "react";
import { OnboardingFormData } from "@/lib/validations/onboarding";

interface UseDesignCreationReturn {
  createDesign: (data: OnboardingFormData) => Promise<{ id: string; status: string }>;
  isLoading: boolean;
  error: string | null;
}

interface CreateDesignResponse {
  id: string;
  status: string;
  message: string;
}

export function useDesignCreation(): UseDesignCreationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDesign = async (data: OnboardingFormData): Promise<{ id: string; status: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform the onboarding data to match API expectations
      const requestData = {
        preferences: {
          roomType: data.roomType,
          size: data.size,
          stylePreference: data.stylePreference,
          budget: data.budget,
          colorScheme: data.colorScheme,
          materialPreferences: data.materialPreferences,
          otherRequirements: data.otherRequirements,
        },
        uploadedImageUrl: data.uploadedImageUrl,
        inputPrompt: generateInputPrompt(data),
      };

      const response = await fetch("/api/designs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create design");
      }

      const result: CreateDesignResponse = await response.json();

      return {
        id: result.id,
        status: result.status,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createDesign,
    isLoading,
    error,
  };
}

// Helper function to generate a comprehensive input prompt from onboarding data
function generateInputPrompt(data: OnboardingFormData): string {
  const {
    roomType,
    size,
    stylePreference,
    budget,
    colorScheme,
    materialPreferences,
    otherRequirements,
  } = data;

  let prompt = `Create a ${stylePreference} design for a ${size} ${roomType?.replace("_", " ")}`;

  // Add budget context
  if (budget) {
    const budgetContext = {
      budget: "with budget-friendly solutions",
      mid_range: "with quality mid-range options",
      luxury: "with premium luxury finishes",
    };
    prompt += ` ${budgetContext[budget]}`;
  }

  // Add color scheme
  if (colorScheme) {
    prompt += `. Use a ${colorScheme.replace("_", " ")} color palette`;
  }

  // Add material preferences
  if (materialPreferences && materialPreferences.length > 0) {
    prompt += `. Incorporate ${materialPreferences.join(", ")} materials`;
  }

  // Add specific requirements
  if (otherRequirements) {
    prompt += `. Additional requirements: ${otherRequirements}`;
  }

  // Add space-specific considerations
  const spaceConsiderations = {
    bedroom: "Focus on creating a restful, peaceful atmosphere with comfortable bedding and adequate storage.",
    living_room: "Prioritize comfortable seating, entertainment areas, and social gathering spaces.",
    kitchen: "Emphasize functionality, storage, and efficient workflow between cooking areas.",
    bathroom: "Focus on spa-like relaxation, storage solutions, and water-resistant materials.",
    office: "Prioritize productivity, ergonomic furniture, and organized storage systems.",
    dining_room: "Create an inviting space for meals and entertaining with appropriate lighting.",
    home_office: "Balance professional appearance with comfort for productive work from home.",
    outdoor: "Use weather-resistant materials and create comfortable outdoor living spaces.",
  };

  if (roomType && spaceConsiderations[roomType]) {
    prompt += ` ${spaceConsiderations[roomType]}`;
  }

  // Add style-specific elements
  const styleElements = {
    modern: "Clean lines, minimal clutter, and contemporary furniture.",
    traditional: "Classic furniture pieces, warm woods, and timeless patterns.",
    industrial: "Raw materials, exposed elements, and urban aesthetics.",
    scandinavian: "Light woods, cozy textiles, and minimalist functionality.",
    bohemian: "Eclectic mix, rich textures, and artistic elements.",
    minimalist: "Essential pieces only, clean spaces, and functional design.",
    rustic: "Natural materials, cozy atmosphere, and countryside charm.",
    contemporary: "Current trends, flexible layouts, and sophisticated touches.",
  };

  if (stylePreference && styleElements[stylePreference]) {
    prompt += ` Include ${styleElements[stylePreference]}`;
  }

  return prompt;
}

export { generateInputPrompt };