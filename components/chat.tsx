import DesignStudio from "@/components/design-studio";

export default function Chat() {
  return (
    <div className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8 py-6">
        <DesignStudio />
      </div>
    </div>
  );
}
