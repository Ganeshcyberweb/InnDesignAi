"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { RiPaletteLine, RiSettingsLine, RiRefreshLine, RiCheckLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTitle, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useFurnitureStore, useDesignFormStore } from "@/stores";
import * as React from "react";
import Image from "next/image";

type SettingsPanelContext = {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  togglePanel: () => void;
};

const SettingsPanelContext = React.createContext<SettingsPanelContext | null>(
  null,
);

function useSettingsPanel() {
  const context = React.useContext(SettingsPanelContext);
  if (!context) {
    throw new Error(
      "useSettingsPanel must be used within a SettingsPanelProvider.",
    );
  }
  return context;
}

const SettingsPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile(1024);
  const [openMobile, setOpenMobile] = React.useState(false);

  // Helper to toggle the sidebar.
  const togglePanel = React.useCallback(() => {
    return isMobile && setOpenMobile((open) => !open);
  }, [isMobile, setOpenMobile]);

  const contextValue = React.useMemo<SettingsPanelContext>(
    () => ({
      isMobile,
      openMobile,
      setOpenMobile,
      togglePanel,
    }),
    [isMobile, openMobile, setOpenMobile, togglePanel],
  );

  return (
    <SettingsPanelContext.Provider value={contextValue}>
      {children}
    </SettingsPanelContext.Provider>
  );
};
SettingsPanelProvider.displayName = "SettingsPanelProvider";

const SettingsPanelContent = () => {
  const {
    suggestedItems,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchSuggestedItems,
    loadMoreItems,
    refreshSuggestedItems
  } = useFurnitureStore();
  const {
    formData,
    addFurnitureItem,
    removeFurnitureItem,
    isFurnitureItemSelected,
    getTotalFurnitureCost,
    getSelectedItemsCount
  } = useDesignFormStore();

  // Fetch suggested items when component mounts or room type changes
  React.useEffect(() => {
    console.log('🔧 Settings Panel: useEffect triggered for room type:', formData.roomType);
    fetchSuggestedItems(formData.roomType);
  }, [formData.roomType, fetchSuggestedItems]);

  const handleItemClick = (item: any) => {
    const isSelected = isFurnitureItemSelected(item.id);

    if (isSelected) {
      removeFurnitureItem(item.id);
      console.log('🗑️ Removed item from selection:', item.name);
    } else {
      addFurnitureItem(item);
      console.log('🛒 Added item to selection:', item.name);
    }
  };

  // Debug store state
  React.useEffect(() => {
    console.log('🏪 Store state debug:', {
      suggestedItemsCount: suggestedItems.length,
      loading,
      error,
      hasMore
    });
  }, [suggestedItems, loading, error, hasMore]);

  return (
    <div className="space-y-6">
      {/* ROI Calculator */}
      <div className="bg-background border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">ROI Calculator</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Investment</span>
            <span className="font-medium">$12,500</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Property Value Increase</span>
            <span className="font-medium text-green-600">+$18,750</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expected ROI</span>
              <span className="text-lg font-bold text-green-600">150%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Items */}
      <div className="bg-background border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Suggested Items</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refreshSuggestedItems()}
            disabled={loading}
          >
            <RiRefreshLine className="w-4 h-4" />
          </Button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-3">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="text-center py-4 space-y-3">
              <div className="text-red-500 text-2xl">❌</div>
              <p className="text-sm text-red-500 font-medium">Failed to load items</p>
              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('🔄 Retrying suggested items fetch...');
                  fetchSuggestedItems(formData.roomType);
                }}
              >
                Retry
              </Button>
            </div>
          ) : suggestedItems.length > 0 ? (
            // Loaded items
            suggestedItems.map((item) => {
              const isSelected = isFurnitureItemSelected(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-primary/10 border border-primary/20 shadow-sm'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
                    {item.image_path ? (
                      <Image
                        src={item.image_path}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
                      </div>
                    )}
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <RiCheckLine className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-2">
                    {item.discount_price && item.discount_price !== item.price ? (
                      <>
                        <p className="text-sm font-medium text-green-600">${item.discount_price}</p>
                        <p className="text-xs text-muted-foreground line-through">${item.price}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">${item.price}</p>
                    )}
                  </div>
                </div>
              </div>
              );
            })
          ) : (
            // Empty state
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No items available</p>
            </div>
          )}

          {/* Loading More Items */}
          {loadingMore && (
            <div className="space-y-3 pt-3 border-t">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`loading-${index}`} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!loading && !error && hasMore && suggestedItems.length > 0 && (
            <div className="pt-3 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => loadMoreItems(formData.roomType)}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More Items'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full" size="lg">
          <RiPaletteLine className="w-4 h-4 mr-2" />
          Save Project
        </Button>

        <Button variant="outline" className="w-full" size="lg">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </Button>

        <Button variant="outline" className="w-full" size="lg">
          <RiSettingsLine className="w-4 h-4 mr-2" />
          Share Design
        </Button>
      </div>
    </div>
  );
};
SettingsPanelContent.displayName = "SettingsPanelContent";

const SettingsPanel = () => {
  const { isMobile, openMobile, setOpenMobile } = useSettingsPanel();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent className="w-72 px-4 md:px-6 py-0 bg-[hsl(240_5%_92.16%)] [&>button]:hidden">
          <SheetTitle className="hidden">Settings</SheetTitle>
          <div className="flex h-full w-full flex-col">
            <SettingsPanelContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <ScrollArea>
      <div className="w-[300px] px-4 md:px-6">
        <SettingsPanelContent />
      </div>
    </ScrollArea>
  );
};
SettingsPanel.displayName = "SettingsPanel";

const SettingsPanelTrigger = ({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { isMobile, togglePanel } = useSettingsPanel();

  if (!isMobile) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className="px-2"
      onClick={(event) => {
        onClick?.(event);
        togglePanel();
      }}
    >
      <RiSettingsLine
        className="text-muted-foreground sm:text-muted-foreground/70 size-5"
        size={20}
        aria-hidden="true"
      />
      <span className="max-sm:sr-only">Settings</span>
    </Button>
  );
};
SettingsPanelTrigger.displayName = "SettingsPanelTrigger";

export {
  SettingsPanel,
  SettingsPanelProvider,
  SettingsPanelTrigger,
  useSettingsPanel,
};
