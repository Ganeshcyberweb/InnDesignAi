import { prisma } from '@/lib/database';
import type { Design } from '@/lib/generated/prisma';

/**
 * Get the full regeneration chain for a design
 * Returns all designs from root to latest, ordered chronologically
 */
export async function getDesignChain(designId: string): Promise<Design[]> {
  // First, find the root design (the one with no parent)
  const rootDesign = await findRootDesign(designId);
  
  if (!rootDesign) {
    throw new Error('Design not found');
  }

  // Get all regenerations starting from the root
  const chain = await getAllRegenerations(rootDesign.id);
  
  return chain;
}

/**
 * Find the root design (original) in the chain
 */
async function findRootDesign(designId: string): Promise<Design | null> {
  let currentDesign: { id: string; parentId: string | null; } | null = await prisma.design.findUnique({
    where: { id: designId },
    select: {
      id: true,
      parentId: true,
    },
  });

  if (!currentDesign) {
    return null;
  }

  // Traverse up the chain to find the root
  while (currentDesign?.parentId) {
    const parent: { id: string; parentId: string | null; } | null = await prisma.design.findUnique({
      where: { id: currentDesign.parentId },
      select: {
        id: true,
        parentId: true,
      },
    });
    
    if (!parent) break;
    currentDesign = parent;
  }

  // Get the full design object for the root
  if (!currentDesign) {
    return null;
  }

  const rootDesign = await prisma.design.findUnique({
    where: { id: currentDesign.id },
  });

  return rootDesign;
}

/**
 * Get all regenerations starting from a root design
 */
async function getAllRegenerations(rootDesignId: string): Promise<Design[]> {
  const designs: Design[] = [];
  const visited = new Set<string>();

  async function traverse(designId: string) {
    if (visited.has(designId)) return;
    visited.add(designId);

    const design = await prisma.design.findUnique({
      where: { id: designId },
      include: {
        childDesigns: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        outputs: true,
      },
    });

    if (!design) return;

    designs.push(design);

    // Traverse children
    for (const child of design.childDesigns) {
      await traverse(child.id);
    }
  }

  await traverse(rootDesignId);
  return designs;
}

/**
 * Create a regeneration of an existing design
 */
export async function createRegeneration(
  parentDesignId: string,
  userId: string,
  inputPrompt: string,
  aiModelUsed: string,
  uploadedImageUrl?: string
): Promise<Design> {
  console.log('🔄 createRegeneration called:', {
    parentDesignId,
    userId,
    promptLength: inputPrompt?.length || 0,
    hasImage: !!uploadedImageUrl,
    aiModel: aiModelUsed,
  });

  // Get parent design to calculate generation number
  const parentDesign = await prisma.design.findUnique({
    where: { id: parentDesignId },
    select: { generationNumber: true },
  });

  if (!parentDesign) {
    console.error('❌ Parent design not found in createRegeneration:', parentDesignId);
    throw new Error('Parent design not found');
  }

  const newGenerationNumber = parentDesign.generationNumber + 1;
  console.log('📈 New generation number will be:', newGenerationNumber);

  const newDesign = await prisma.design.create({
    data: {
      userId,
      description: inputPrompt,
      imageUrl: uploadedImageUrl,
      customRequirements: aiModelUsed,
      parentId: parentDesignId,
      generationNumber: newGenerationNumber,
      status: 'PENDING',
    },
    include: {
      parentDesign: true,
      outputs: true,
    },
  });

  console.log('✅ Regeneration design created:', {
    newDesignId: newDesign.id,
    parentId: newDesign.parentId,
    generationNumber: newDesign.generationNumber,
    status: newDesign.status,
  });

  return newDesign;
}

/**
 * Get the latest design in a regeneration chain
 */
export async function getLatestRegeneration(designId: string): Promise<Design | null> {
  const chain = await getDesignChain(designId);
  
  if (chain.length === 0) {
    return null;
  }

  // Return the last design in the chain
  return chain[chain.length - 1];
}

/**
 * Get regeneration statistics for a design chain
 */
export async function getRegenerationStats(designId: string) {
  const chain = await getDesignChain(designId);
  
  return {
    totalRegenerations: chain.length,
    rootDesignId: chain[0]?.id || null,
    latestDesignId: chain[chain.length - 1]?.id || null,
    generationNumbers: chain.map(d => d.generationNumber),
    createdDates: chain.map(d => d.createdAt),
  };
}

/**
 * Check if a design has any regenerations
 */
export async function hasRegenerations(designId: string): Promise<boolean> {
  const count = await prisma.design.count({
    where: {
      parentId: designId,
    },
  });

  return count > 0;
}

/**
 * Get direct children (immediate regenerations) of a design
 */
export async function getDirectRegenerations(designId: string): Promise<Design[]> {
  const regenerations = await prisma.design.findMany({
    where: {
      parentId: designId,
    },
    include: {
      outputs: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return regenerations;
}
