import { PromptTemplate } from './types';

export class PromptEngineer {
  private static readonly BASE_PROMPT = "Professional interior design photograph of a";
  private static readonly QUALITY_MODIFIERS = "high resolution, architectural visualization, professional lighting, photorealistic";

  // Room-specific optimization
  private static readonly ROOM_SPECIFICS = {
    living_room: "comfortable seating arrangements, focal point, natural lighting, entertainment area",
    bedroom: "restful atmosphere, privacy, storage solutions, comfortable bedding",
    kitchen: "functional workflow, storage, food preparation areas, dining integration",
    bathroom: "clean lines, moisture resistance, storage, privacy, lighting",
    dining_room: "entertaining space, table focal point, ambient lighting",
    home_office: "productivity focus, ergonomic furniture, organization, natural lighting",
    outdoor: "weather-resistant materials, natural integration, outdoor living comfort"
  };

  // Style-specific keywords and aesthetics
  private static readonly STYLE_KEYWORDS = {
    modern: "clean lines, minimalist, contemporary furniture, neutral colors, geometric shapes",
    traditional: "classic furniture, rich textures, warm colors, ornate details, timeless elements",
    scandinavian: "light woods, white and neutral tones, cozy textures, functional design, hygge",
    industrial: "exposed brick, metal accents, concrete, Edison bulbs, urban aesthetic",
    bohemian: "eclectic patterns, vibrant colors, layered textures, plants, artistic elements",
    minimalist: "clean spaces, essential furniture only, monochromatic, uncluttered",
    rustic: "natural materials, wood beams, stone, earthy colors, cozy atmosphere",
    contemporary: "current trends, mixed materials, bold accents, innovative design"
  };

  // Budget-conscious material suggestions
  private static readonly BUDGET_MATERIALS = {
    budget: "affordable materials, laminate, engineered wood, budget-friendly textiles, DIY elements",
    mid_range: "quality materials, solid wood accents, branded appliances, designer-inspired pieces",
    luxury: "premium materials, natural stone, hardwood floors, high-end appliances, custom furniture"
  };

  // Size-specific considerations
  private static readonly SIZE_OPTIMIZATION = {
    small: "space-saving furniture, multi-functional pieces, vertical storage, light colors to expand space",
    medium: "balanced proportions, comfortable scale, flexible arrangements",
    large: "statement pieces, multiple seating areas, grand scale furniture, room zoning"
  };

  // Color scheme enhancements
  private static readonly COLOR_ENHANCEMENTS = {
    neutral: "beige, cream, white, gray tones, natural textures",
    warm: "earth tones, reds, oranges, yellows, cozy atmosphere",
    cool: "blues, greens, purples, calming palette, serene mood",
    monochrome: "black and white, grayscale, contrast through texture",
    bold: "vibrant colors, statement walls, colorful accents, energetic mood"
  };

  static generatePrompt(template: PromptTemplate): string {
    const {
      room_type,
      style_preference,
      size,
      budget_level,
      color_scheme,
      material_preferences = [],
      additional_requirements = "",
      uploaded_image_context = ""
    } = template;

    // Start with base structure
    let prompt = `${this.BASE_PROMPT} ${style_preference} ${room_type}`;

    // Add size considerations
    if (this.SIZE_OPTIMIZATION[size as keyof typeof this.SIZE_OPTIMIZATION]) {
      prompt += `, ${size} space with ${this.SIZE_OPTIMIZATION[size as keyof typeof this.SIZE_OPTIMIZATION]}`;
    }

    // Add style-specific elements
    if (this.STYLE_KEYWORDS[style_preference as keyof typeof this.STYLE_KEYWORDS]) {
      prompt += `, featuring ${this.STYLE_KEYWORDS[style_preference as keyof typeof this.STYLE_KEYWORDS]}`;
    }

    // Add room-specific elements
    if (this.ROOM_SPECIFICS[room_type as keyof typeof this.ROOM_SPECIFICS]) {
      prompt += `, incorporating ${this.ROOM_SPECIFICS[room_type as keyof typeof this.ROOM_SPECIFICS]}`;
    }

    // Add budget-appropriate materials
    if (this.BUDGET_MATERIALS[budget_level]) {
      prompt += `, using ${this.BUDGET_MATERIALS[budget_level]}`;
    }

    // Add color scheme if specified
    if (color_scheme && this.COLOR_ENHANCEMENTS[color_scheme as keyof typeof this.COLOR_ENHANCEMENTS]) {
      prompt += `, with ${this.COLOR_ENHANCEMENTS[color_scheme as keyof typeof this.COLOR_ENHANCEMENTS]}`;
    }

    // Add material preferences
    if (material_preferences.length > 0) {
      prompt += `, emphasizing ${material_preferences.join(', ')}`;
    }

    // Add uploaded image context if provided
    if (uploaded_image_context) {
      prompt += `, ${uploaded_image_context}`;
    }

    // Add additional requirements
    if (additional_requirements) {
      prompt += `, ${additional_requirements}`;
    }

    // Add quality modifiers
    prompt += `, ${this.QUALITY_MODIFIERS}`;

    return prompt;
  }

  static generateVariationPrompts(basePrompt: string, numVariations: number = 3): string[] {
    const variations = [basePrompt]; // Include original

    const variationModifiers = [
      "with different lighting and camera angle",
      "from an alternative perspective with varied furniture arrangement",
      "with alternative color palette and texture combinations",
      "showcasing different decorative elements and accessories",
      "emphasizing different focal points and spatial arrangements"
    ];

    for (let i = 1; i < numVariations && i < variationModifiers.length + 1; i++) {
      variations.push(`${basePrompt}, ${variationModifiers[i - 1]}`);
    }

    return variations.slice(0, numVariations);
  }

  static optimizeForProvider(prompt: string, provider: 'replicate' | 'openai'): string {
    switch (provider) {
      case 'replicate':
        // Replicate (Stable Diffusion) works well with detailed, descriptive prompts
        return `${prompt}, masterpiece, best quality, highly detailed, sharp focus`;

      case 'openai':
        // DALL-E prefers more natural language descriptions
        return `A beautiful ${prompt.toLowerCase()}`;

      default:
        return prompt;
    }
  }

  static extractStyleElements(preferences: any): {
    dominant_style: string;
    secondary_elements: string[];
    atmosphere: string;
  } {
    const style = preferences.stylePreference || 'modern';
    const room = preferences.roomType || 'living_room';

    // Determine atmosphere based on style and room combination
    const atmosphereMap: Record<string, string> = {
      modern: "clean and sophisticated",
      traditional: "warm and inviting",
      scandinavian: "cozy and bright",
      industrial: "edgy and urban",
      bohemian: "eclectic and artistic",
      minimalist: "serene and uncluttered",
      rustic: "cozy and natural",
      contemporary: "fresh and current"
    };

    return {
      dominant_style: style,
      secondary_elements: this.STYLE_KEYWORDS[style as keyof typeof this.STYLE_KEYWORDS]?.split(', ') || [],
      atmosphere: atmosphereMap[style] || "comfortable and stylish"
    };
  }

  static generateNegativePrompt(): string {
    return "blurry, low quality, distorted, unrealistic proportions, bad lighting, cluttered, messy, unprofessional, low resolution, pixelated, oversaturated, dark, gloomy";
  }
}