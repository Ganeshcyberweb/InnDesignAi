"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";
import {
  SettingsPanelProvider,
  SettingsPanel,
} from "@/components/settings-panel";
import Chat from "@/components/chat";
import { DesignChatInput } from "@/components/design-chat-input";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import { AnimatedChainOfThought } from "@/components/animated-chain-of-thought";
import { FurnitureSuggestionsCarousel } from "@/components/furniture-suggestions-carousel";
import { useDesignFormStore } from "@/stores/design-form-store";

export default function Page() {
  const { formData } = useDesignFormStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background group/sidebar-inset">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-backround text-sidebar-foreground relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
          <SidebarTrigger className="-ms-2" />
          <div className="flex items-center gap-8 ml-auto">
            <UserDropdown />
          </div>
        </header>
        <div className="flex-1 p-6 h-fit overflow-auto mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">InnDesign Studio</h1>
              <p className="text-muted-foreground">Create stunning interior designs with AI assistance</p>
            </div>

            {/* Chain of Thought - AI Results Display */}
            <div className="mb-8">
              <AnimatedChainOfThought
                className="w-full"
                intervalMs={3500}
                isProcessing={true}
              />
            </div>

            {/* Furniture Suggestions Carousel */}
            <div className="mb-8">
              <FurnitureSuggestionsCarousel
                budgetRange={formData.budgetRange}
                roomType={formData.roomType}
                className="w-full"
              />
            </div>

            <div className="relative my-10">
              <DesignChatInput
                onSubmit={(message) => console.log("Design submitted:", message)}
                className="mb-8 relative z-10"
                alwaysOpen={true}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
