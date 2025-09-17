import { z } from "zod";

// Individual step schemas
export const roomTypeSchema = z.object({
  roomType: z.enum([
    "bedroom",
    "living_room",
    "kitchen",
    "bathroom",
    "office",
    "dining_room",
    "home_office",
    "outdoor"
  ], {
    required_error: "Please select a room type",
  }),
});

export const roomSizeSchema = z.object({
  size: z.enum([
    "small",
    "medium",
    "large",
    "extra_large"
  ], {
    required_error: "Please select a room size",
  }),
});

export const stylePreferenceSchema = z.object({
  stylePreference: z.enum([
    "modern",
    "traditional",
    "industrial",
    "scandinavian",
    "bohemian",
    "minimalist",
    "rustic",
    "contemporary"
  ], {
    required_error: "Please select a style preference",
  }),
});

export const budgetRangeSchema = z.object({
  budget: z.enum([
    "budget",
    "mid_range",
    "luxury"
  ], {
    required_error: "Please select a budget range",
  }),
});

export const colorSchemeSchema = z.object({
  colorScheme: z.enum([
    "neutral",
    "warm",
    "cool",
    "bold",
    "monochrome",
    "earthy",
    "pastels"
  ]).optional(),
});

export const materialPreferencesSchema = z.object({
  materialPreferences: z.array(z.string()).optional(),
});

export const additionalRequirementsSchema = z.object({
  otherRequirements: z.string().max(1000, "Requirements must be under 1000 characters").optional(),
});

export const imageUploadSchema = z.object({
  uploadedImageUrl: z.string().url().optional(),
  uploadedImageFile: z.any().optional(),
});

// Complete onboarding form schema
export const onboardingFormSchema = roomTypeSchema
  .merge(roomSizeSchema)
  .merge(stylePreferenceSchema)
  .merge(budgetRangeSchema)
  .merge(colorSchemeSchema)
  .merge(materialPreferencesSchema)
  .merge(additionalRequirementsSchema)
  .merge(imageUploadSchema);

// TypeScript types
export type RoomType = z.infer<typeof roomTypeSchema>["roomType"];
export type RoomSize = z.infer<typeof roomSizeSchema>["size"];
export type StylePreference = z.infer<typeof stylePreferenceSchema>["stylePreference"];
export type BudgetRange = z.infer<typeof budgetRangeSchema>["budget"];
export type ColorScheme = z.infer<typeof colorSchemeSchema>["colorScheme"];

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

// Step-specific types
export type RoomTypeFormData = z.infer<typeof roomTypeSchema>;
export type RoomSizeFormData = z.infer<typeof roomSizeSchema>;
export type StylePreferenceFormData = z.infer<typeof stylePreferenceSchema>;
export type BudgetRangeFormData = z.infer<typeof budgetRangeSchema>;
export type ColorSchemeFormData = z.infer<typeof colorSchemeSchema>;
export type MaterialPreferencesFormData = z.infer<typeof materialPreferencesSchema>;
export type AdditionalRequirementsFormData = z.infer<typeof additionalRequirementsSchema>;
export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;

// Onboarding step configuration
export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: string;
  isOptional?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Room Type",
    description: "What type of room are you designing?",
    component: "RoomTypeStep",
  },
  {
    id: 2,
    title: "Room Size",
    description: "How large is your space?",
    component: "RoomSizeStep",
  },
  {
    id: 3,
    title: "Style Preference",
    description: "What design style do you prefer?",
    component: "StylePreferenceStep",
  },
  {
    id: 4,
    title: "Budget Range",
    description: "What's your budget for this project?",
    component: "BudgetRangeStep",
  },
  {
    id: 5,
    title: "Color Scheme",
    description: "What colors do you gravitate towards?",
    component: "ColorSchemeStep",
    isOptional: true,
  },
  {
    id: 6,
    title: "Materials",
    description: "Any material preferences?",
    component: "MaterialPreferencesStep",
    isOptional: true,
  },
  {
    id: 7,
    title: "Additional Requirements",
    description: "Any specific requirements or notes?",
    component: "AdditionalRequirementsStep",
    isOptional: true,
  },
  {
    id: 8,
    title: "Reference Image",
    description: "Upload a reference image (optional)",
    component: "ImageUploadStep",
    isOptional: true,
  },
];

// Material options
export const MATERIAL_OPTIONS = [
  "Wood",
  "Metal",
  "Glass",
  "Stone",
  "Fabric",
  "Leather",
  "Concrete",
  "Marble",
  "Ceramic",
  "Bamboo",
  "Rattan",
  "Velvet",
  "Linen",
  "Wool",
] as const;

// Room type descriptions and icons
export const ROOM_TYPE_INFO = {
  bedroom: {
    label: "Bedroom",
    description: "Create a peaceful and comfortable sleeping space",
    icon: "🛏️",
  },
  living_room: {
    label: "Living Room",
    description: "Design a welcoming space for relaxation and entertainment",
    icon: "🛋️",
  },
  kitchen: {
    label: "Kitchen",
    description: "Build a functional and beautiful cooking space",
    icon: "🍳",
  },
  bathroom: {
    label: "Bathroom",
    description: "Design a clean and spa-like personal space",
    icon: "🛁",
  },
  office: {
    label: "Office",
    description: "Create a productive and inspiring workspace",
    icon: "💼",
  },
  dining_room: {
    label: "Dining Room",
    description: "Design an elegant space for meals and gatherings",
    icon: "🍽️",
  },
  home_office: {
    label: "Home Office",
    description: "Create a productive work-from-home environment",
    icon: "🏠",
  },
  outdoor: {
    label: "Outdoor Space",
    description: "Design beautiful outdoor living areas",
    icon: "🌿",
  },
} as const;

// Style preference descriptions
export const STYLE_INFO = {
  modern: {
    label: "Modern",
    description: "Clean lines, minimal clutter, contemporary aesthetics",
    keywords: ["minimalist", "sleek", "contemporary"],
  },
  traditional: {
    label: "Traditional",
    description: "Classic designs with timeless appeal",
    keywords: ["classic", "elegant", "refined"],
  },
  industrial: {
    label: "Industrial",
    description: "Raw materials, exposed elements, urban feel",
    keywords: ["raw", "urban", "edgy"],
  },
  scandinavian: {
    label: "Scandinavian",
    description: "Light colors, natural materials, cozy minimalism",
    keywords: ["hygge", "natural", "bright"],
  },
  bohemian: {
    label: "Bohemian",
    description: "Eclectic mix, rich textures, artistic flair",
    keywords: ["eclectic", "artistic", "colorful"],
  },
  minimalist: {
    label: "Minimalist",
    description: "Less is more, clean spaces, functional design",
    keywords: ["simple", "clean", "uncluttered"],
  },
  rustic: {
    label: "Rustic",
    description: "Natural materials, cozy atmosphere, countryside charm",
    keywords: ["natural", "cozy", "warm"],
  },
  contemporary: {
    label: "Contemporary",
    description: "Current trends, flexible design, sophisticated",
    keywords: ["current", "sophisticated", "flexible"],
  },
} as const;

// Budget range descriptions
export const BUDGET_INFO = {
  budget: {
    label: "Budget-Friendly",
    description: "Smart solutions under $1,000",
    range: "Under $1,000",
    icon: "💰",
  },
  mid_range: {
    label: "Mid-Range",
    description: "Quality upgrades $1,000 - $10,000",
    range: "$1,000 - $10,000",
    icon: "💳",
  },
  luxury: {
    label: "Luxury",
    description: "Premium materials and finishes $10,000+",
    range: "$10,000+",
    icon: "✨",
  },
} as const;