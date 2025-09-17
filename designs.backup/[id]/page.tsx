import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@/src/generated/prisma';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

interface PageProps {
  params: {
    id: string;
  };
}

export default async function DesignPage({ params }: PageProps) {
  // Check if user is authenticated
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  // Fetch the design with preferences
  const design = await prisma.design.findFirst({
    where: {
      id: params.id,
      userId: user.id, // Ensure user can only see their own designs
    },
    include: {
      preferences: true,
      designOutputs: true,
    }
  });

  if (!design) {
    redirect('/dashboard');
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-accent text-yellow-800';
      case 'PROCESSING':
        return 'bg-primary/10 text-blue-800';
      case 'COMPLETED':
        return 'bg-primary/10 text-green-800';
      case 'FAILED':
        return 'bg-destructive/10 text-red-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'PROCESSING':
        return <Sparkles className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Design Project</h1>
              <p className="text-slate-600 mt-1">
                Created {new Date(design.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Badge className={`${getStatusColor(design.status)} flex items-center gap-1`}>
              {getStatusIcon(design.status)}
              {design.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Project Status</h2>

              {design.status === 'PENDING' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Design Generation Queued
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Your design preferences have been saved and will be processed soon.
                  </p>
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start AI Generation
                  </Button>
                </div>
              )}

              {design.status === 'PROCESSING' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Generating Your Design
                  </h3>
                  <p className="text-slate-600">
                    Our AI is creating personalized design recommendations based on your preferences.
                  </p>
                </div>
              )}

              {design.status === 'COMPLETED' && design.designOutputs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Generated Designs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {design.designOutputs.map((output) => (
                      <div key={output.id} className="relative group">
                        <img
                          src={output.outputImageUrl}
                          alt={output.variationName || 'Design variation'}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Button
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            View Details
                          </Button>
                        </div>
                        {output.variationName && (
                          <p className="mt-2 text-sm font-medium text-slate-700">
                            {output.variationName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Reference Image */}
            {design.uploadedImageUrl && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Reference Image</h2>
                <img
                  src={design.uploadedImageUrl}
                  alt="Reference"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preferences Summary */}
            {design.preferences && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Design Preferences</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-600">Room Type</span>
                    <p className="font-medium capitalize">{design.preferences.roomType.replace('_', ' ')}</p>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600">Size</span>
                    <p className="font-medium capitalize">{design.preferences.size}</p>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600">Style</span>
                    <p className="font-medium capitalize">{design.preferences.stylePreference}</p>
                  </div>

                  {design.preferences.budget && (
                    <div>
                      <span className="text-sm text-slate-600">Budget Range</span>
                      <p className="font-medium">${design.preferences.budget.toLocaleString()}</p>
                    </div>
                  )}

                  {design.preferences.colorScheme && (
                    <div>
                      <span className="text-sm text-slate-600">Color Scheme</span>
                      <p className="font-medium capitalize">{design.preferences.colorScheme}</p>
                    </div>
                  )}

                  {design.preferences.materialPreferences && (
                    <div>
                      <span className="text-sm text-slate-600">Materials</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {JSON.parse(design.preferences.materialPreferences).map((material: string) => (
                          <Badge key={material} variant="secondary" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Requirements */}
            {design.preferences?.otherRequirements && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Special Requirements</h2>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {design.preferences.otherRequirements}
                </p>
              </Card>
            )}

            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Edit Preferences
                </Button>
                <Button className="w-full" variant="outline">
                  Generate New Variations
                </Button>
                <Button className="w-full" variant="outline">
                  Download Designs
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}