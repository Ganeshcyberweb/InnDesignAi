import { Suspense } from 'react';
import { createServerClient } from '@/app/lib/supabase/server';
import { notFound } from 'next/navigation';
import { DesignViewerPage } from './DesignViewerPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getDesign(designId: string, userId: string) {
  const supabase = await createServerClient();

  const { data: design, error } = await supabase
    .from('designs')
    .select(`
      *,
      preferences (*),
      design_outputs (*),
      roi_calculations (*),
      feedback (*)
    `)
    .eq('id', designId)
    .eq('user_id', userId)
    .single();

  if (error || !design) {
    return null;
  }

  return design;
}

export default async function DesignPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    notFound();
  }

  const design = await getDesign(id, user.id);
  if (!design) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <DesignViewerPage design={design} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `Design ${id} - InnDesign AI`,
    description: 'View and analyze your AI-generated interior design',
  };
}