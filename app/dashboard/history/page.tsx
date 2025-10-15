"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  GitBranch,
  AlertCircle,
  Sparkles,
  Clock,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Download
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDesignHistoryStore } from "@/stores/design-history-store";
import { cn } from "@/lib/utils";
import { R2Image } from "@/components/ui/r2-image";
import { downloadDesignPackage } from "@/lib/utils/download";
import { toast } from "sonner";

export default function DashboardHistoryPage() {
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Use Zustand store instead of local state
  const {
    getAllDesigns,
    fetchAllDesigns,
    refreshIfStale,
    isLoadingAll,
    errors,
    getLastFetchTime,
    clearError,
  } = useDesignHistoryStore();

  const designs = getAllDesigns();
  const error = errors.all;
  const lastFetchTime = getLastFetchTime();

  useEffect(() => {
    // Smart fetch - will use cache if valid, very minimal API calls
    refreshIfStale();
  }, [refreshIfStale]);

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchAllDesigns(true); // Force refresh
  };

  const handleDownload = async (e: React.MouseEvent, design: any) => {
    e.stopPropagation();
    
    if (downloadingId) {
      toast.warning('Please wait for the current download to complete');
      return;
    }

    setDownloadingId(design.id);
    toast.loading('Preparing download...', { id: 'download' });

    try {
      await downloadDesignPackage(
        design,
        design.designOutputs || [],
        design.roiNotes || null
      );
      toast.success('Download complete!', { id: 'download' });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download design package', { id: 'download' });
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoadingAll) {
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
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
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
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GitBranch className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">Design History</h1>
                  </div>
                  <p className="text-muted-foreground">
                    View all your designs and their regeneration chains
                  </p>
                  {lastFetchTime && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Last updated: {formatDistanceToNow(lastFetchTime, { addSuffix: true })}
                      </p>
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        Cached
                      </Badge>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isLoadingAll}
                  className="flex-shrink-0"
                >
                  <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingAll && "animate-spin")} />
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
                    onClick={() => clearError('all')}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Design Chains</CardDescription>
                  <CardTitle className="text-3xl">{designs.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Regenerations</CardDescription>
                  <CardTitle className="text-3xl">
                    {designs.reduce((acc, d) => acc + (d.chainLength || 1), 0)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Avg Chain Length</CardDescription>
                  <CardTitle className="text-3xl">
                    {designs.length > 0
                      ? (designs.reduce((acc, d) => acc + (d.chainLength || 1), 0) / designs.length).toFixed(1)
                      : '0'}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Designs List */}
            <div className="space-y-4">
              {designs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <GitBranch className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Designs Yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Create your first design to get started
                    </p>
                    <Button onClick={() => router.push('/dashboard')}>
                      Create Design
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                designs.map((design) => (
                  <Card 
                    key={design.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/designs/${design.id}/history`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* Generated Image Preview */}
                        {design.designOutputs && design.designOutputs.length > 0 && design.designOutputs[0].outputImageUrl && (
                          <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                            <R2Image
                              src={design.designOutputs[0].outputImageUrl}
                              alt={`Design ${design.id.slice(0, 8)} preview`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                            <h3 className="font-semibold text-lg truncate">
                              {design.title || `Design #${design.id.slice(0, 8)}`}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(design.status)}
                            >
                              {design.status}
                            </Badge>
                          </div>

                          {/* Prompt Preview */}
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {design.description}
                          </p>

                          {/* Latest Output Info */}
                          {design.designOutputs && design.designOutputs.length > 0 && (
                            <p className="text-sm text-primary mb-2">
                              Latest: {design.designOutputs[0].variationName || 'Generated Image'}
                            </p>
                          )}

                          {/* Meta Information */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatDistanceToNow(new Date(design.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitBranch className="w-4 h-4" />
                              <span>
                                {design.chainLength || 1} generation{(design.chainLength || 1) !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4" />
                              <span>{design.customRequirements || 'AI Generated'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={(e) => handleDownload(e, design)}
                            disabled={downloadingId === design.id}
                            title="Download design package"
                          >
                            <Download className={cn(
                              "w-5 h-5",
                              downloadingId === design.id && "animate-pulse"
                            )} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/designs/${design.id}/history`);
                            }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Chain Preview Bar */}
                      {design.chainLength && design.chainLength > 1 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: '100%' }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {design.chainLength} versions
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
