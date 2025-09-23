"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { RiPaletteLine, RiSettingsLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTitle, SheetContent } from "@/components/ui/sheet";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const suggestedItems = [
    { name: "Modern Sofa", price: "$1,200", image: null },
    { name: "Coffee Table", price: "$449", image: null },
    { name: "Floor Lamp", price: "$189", image: null },
    { name: "Area Rug", price: "$329", image: null },
  ];

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
        <h3 className="text-lg font-semibold mb-4">Suggested Items</h3>

        <div className="space-y-3">
          {suggestedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.price}</p>
              </div>
            </div>
          ))}
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
