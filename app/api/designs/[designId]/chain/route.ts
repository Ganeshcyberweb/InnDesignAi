import { NextRequest, NextResponse } from 'next/server';
import { getDesignChain, getRegenerationStats } from '@/lib/design-regeneration';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ designId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { designId } = await params;

    // Get the design chain
    const chain = await getDesignChain(designId);

    // Verify the user owns the design
    if (chain.length > 0 && chain[0].userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get stats
    const stats = await getRegenerationStats(designId);

    return NextResponse.json({
      success: true,
      chain,
      stats,
    });
  } catch (error) {
    console.error('Error fetching design chain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch design chain' },
      { status: 500 }
    );
  }
}
