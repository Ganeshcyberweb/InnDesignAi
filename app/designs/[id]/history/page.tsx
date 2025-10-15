"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";
import { DesignRegenerationHistory } from "@/components/design-regeneration-history";
import { DesignRegenerationTimeline } from "@/components/design-regeneration-timeline";
import { useDesignHistoryStore } from "@/stores/design-history-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, ArrowLeft, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { downloadDesignPackage } from "@/lib/utils/download";
import { toast } from "sonner";

export default function DesignHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const designId = params.id as string;
  const [selectedDesignId, setSelectedDesignId] = useState<string>(designId);
  const [isDownloading, setIsDownloading] = useState(false);

  // Use Zustand store instead of custom hook
  const {
    getChain,
    getStats,
    fetchDesignChain,
    isLoadingChain,
    errors,
    clearError,
  } = useDesignHistoryStore();

  const chain = getChain(designId) || [];
  const stats = getStats(designId);
  const isLoading = isLoadingChain[designId] || false;
  const error = errors[designId];

  useEffect(() => {
    if (designId) {
      // Smart fetch - will use cache if valid
      fetchDesignChain(designId);
    }
  }, [designId, fetchDesignChain]);

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered for chain:', designId.slice(0, 8));
    fetchDesignChain(designId, true); // Force refresh
  };

  const handleSelectDesign = (id: string) => {
    setSelectedDesignId(id);
    // You could navigate to the specific design or update the view
    // router.push(`/designs/${id}`);
  };

  const handleRegenerate = () => {
    // Navigate back to dashboard with the design context
    router.push(`/dashboard?regenerateFrom=${selectedDesignId}`);
  };

  const handleDownloadSelected = async () => {
    if (isDownloading) {
      toast.warning('Please wait for the current download to complete');
      return;
    }

    const selectedDesign = chain.find(d => d.id === selectedDesignId);
    if (!selectedDesign) {
      toast.error('Selected design not found');
      return;
    }

    setIsDownloading(true);
    toast.loading('Preparing download with fresh signed URLs...', { id: 'download' });

    try {
      // downloadDesignPackage now fetches fresh data from API internally
      await downloadDesignPackage(
        selectedDesign,
        selectedDesign.designOutputs || [],
        selectedDesign.roiNotes || null
      );
      toast.success('Download complete!', { id: 'download' });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download design package. Please try again.', { id: 'download' });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background group/sidebar-inset">
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-background text-sidebar-foreground">
            <SidebarTrigger className="-ms-2" />
            <div className="flex items-center gap-8 ml-auto">
              <UserDropdown />
            </div>
          </header>
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background group/sidebar-inset">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-background text-sidebar-foreground">
          <SidebarTrigger className="-ms-2" />
          <div className="flex items-center gap-8 ml-auto">
            <UserDropdown />
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Design History</h1>
                  <p className="text-muted-foreground">
                    View all regenerations and variations of this design
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isLoading}
                  className="flex-shrink-0"
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center justify-between gap-2">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearError(designId)}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Stats Card */}
            {stats && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                  <CardDescription>Overview of this design's evolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Generations</p>
                      <p className="text-2xl font-bold">{stats.totalRegenerations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Generation</p>
                      <p className="text-2xl font-bold">
                        {chain.find(d => d.id === selectedDesignId)?.generationNumber || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Original Design</p>
                      <p className="text-sm font-medium truncate">
                        {stats.rootDesignId?.slice(0, 8)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Latest Design</p>
                      <p className="text-sm font-medium truncate">
                        {stats.latestDesignId?.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            {chain.length > 0 && (
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                    <CardDescription>Quick navigation through generations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DesignRegenerationTimeline
                      designs={chain}
                      currentDesignId={selectedDesignId}
                      onSelectDesign={handleSelectDesign}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button onClick={handleRegenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Create New Regeneration
              </Button>
              <Button 
                onClick={handleDownloadSelected} 
                disabled={isDownloading}
                variant="outline"
              >
                <Download className={cn(
                  "w-4 h-4 mr-2",
                  isDownloading && "animate-pulse"
                )} />
                Download Selected Design
              </Button>
            </div>

            {/* Full History */}
            <DesignRegenerationHistory
              designs={chain}
              currentDesignId={selectedDesignId}
              onSelectDesign={handleSelectDesign}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
