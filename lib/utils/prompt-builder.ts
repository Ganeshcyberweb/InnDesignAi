import type { FurnitureProduct } from '@/types/furniture';

interface DesignFormData {
  prompt: string;
  roomType: string;
  roomSize: string;
  stylePreference: string;
  budgetRange: string;
  colorPalette: string;
  selectedFurnitureItems: FurnitureProduct[];
}

const ROOM_TYPE_DESCRIPTIONS = {
  living_room: "living room with comfortable seating and entertainment area",
  bedroom: "peaceful bedroom with sleeping and relaxation spaces",
  kitchen: "functional kitchen with cooking and dining areas",
  bathroom: "clean bathroom with proper fixtures and storage",
  dining_room: "elegant dining room for meals and gatherings",
  office: "productive office space for work and study"
};

const STYLE_DESCRIPTIONS = {
  modern: "clean lines, minimalist aesthetic, neutral colors, and contemporary materials",
  traditional: "classic furnishings, rich textures, warm colors, and timeless elegance",
  scandinavian: "light woods, simple forms, cozy textures, and bright, airy spaces",
  industrial: "exposed materials, metal accents, brick walls, and urban aesthetics",
  bohemian: "eclectic mix, vibrant colors, layered textiles, and artistic elements",
  mediterranean: "warm earth tones, natural materials, curved lines, and coastal influences"
};

const COLOR_PALETTE_DESCRIPTIONS = {
  neutral: "neutral palette with blacks, grays, and soft whites for a sophisticated balance",
  warm: "warm palette with deep reds, golden yellows, and cream tones for cozy comfort",
  cool: "cool palette with blues and light tones for a calming, serene atmosphere",
  earth: "earth tones with browns, oranges, and warm creams for natural warmth"
};

export function buildDesignPrompt(formData: DesignFormData): string {
  const {
    prompt,
    roomType,
    roomSize,
    stylePreference,
    budgetRange,
    colorPalette,
    selectedFurnitureItems
  } = formData;

  // Base room description
  const roomDescription = ROOM_TYPE_DESCRIPTIONS[roomType as keyof typeof ROOM_TYPE_DESCRIPTIONS] || roomType;

  // Style guidance
  const styleDescription = STYLE_DESCRIPTIONS[stylePreference as keyof typeof STYLE_DESCRIPTIONS] || stylePreference;

  // Color palette guidance
  const colorDescription = COLOR_PALETTE_DESCRIPTIONS[colorPalette as keyof typeof COLOR_PALETTE_DESCRIPTIONS] || colorPalette;

  // Room size guidance
  const sizeGuidance = roomSize ? `The space is approximately ${roomSize} square feet.` : '';

  // Budget considerations
  const budgetGuidance = `Budget range: ${budgetRange}. Design should reflect appropriate quality and materials for this budget level.`;

  // Selected furniture integration
  let furnitureGuidance = '';
  if (selectedFurnitureItems && selectedFurnitureItems.length > 0) {
    const furnitureDescriptions = selectedFurnitureItems.map(item =>
      `${item.name} (${item.category}, ${item.wood_type}, ${item.dimensions.width}"W x ${item.dimensions.height}"H x ${item.dimensions.depth}"D)`
    ).join(', ');

    furnitureGuidance = `Specific furniture to incorporate: ${furnitureDescriptions}. Position and arrange these pieces naturally within the room layout.`;
  }

  // Combine all elements into a comprehensive prompt
  const enhancedPrompt = `
Create a beautiful interior design image for a ${roomDescription}.

USER REQUEST: "${prompt}"

DESIGN SPECIFICATIONS:
- Style: ${styleDescription}
- Color Scheme: ${colorDescription}
- ${sizeGuidance}
- ${budgetGuidance}
${furnitureGuidance ? `- ${furnitureGuidance}` : ''}

COMPOSITION REQUIREMENTS:
- Show a complete, well-furnished room with proper lighting
- Include realistic textures, materials, and finishes appropriate for the style
- Ensure proper scale and proportions for all furniture and decor
- Create a cohesive color scheme that matches the specified palette
- Add complementary decor items like artwork, plants, lighting fixtures, and accessories
- Show proper room flow and functionality
- Render in high quality with realistic lighting and shadows
- Capture the essence of ${stylePreference} design while meeting the user's specific request

Generate a photorealistic interior design image that brings this vision to life.
  `.trim();

  return enhancedPrompt;
}

export function buildSystemInstructions(): string {
  return `You are an expert interior designer with 20+ years of experience creating stunning, functional spaces. You specialize in generating photorealistic interior design images that perfectly blend aesthetics with functionality.

EXPERTISE AREAS:
- Space planning and room layout optimization
- Color theory and palette coordination
- Furniture selection and arrangement
- Lighting design (natural and artificial)
- Material and texture combinations
- Style interpretation (modern, traditional, scandinavian, industrial, bohemian, mediterranean)
- Budget-conscious design solutions
- Ergonomics and accessibility

IMAGE GENERATION STANDARDS:
- Create photorealistic, high-quality interior images
- Ensure proper perspective and realistic proportions
- Use natural lighting with appropriate shadows and highlights
- Include rich textures and materials that match the specified style
- Show complete room views with all essential furniture and decor
- Maintain consistency in design style throughout the space
- Add complementary accessories and finishing touches
- Ensure colors are vibrant yet realistic

COMPOSITION GUIDELINES:
- Frame shots to show the complete room layout
- Include windows or light sources for natural illumination
- Position furniture for optimal traffic flow
- Add plants, artwork, and decorative elements for warmth
- Show proper scale relationships between all elements
- Create visual focal points and design hierarchy
- Demonstrate the lifestyle and atmosphere of the space

Generate interior designs that are both inspiring and practically achievable.`;
}