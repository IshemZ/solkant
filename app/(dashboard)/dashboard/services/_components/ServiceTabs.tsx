"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ServiceTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "services";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="border-b border-foreground/10 mb-6">
      <div className="flex gap-8">
        <button
          onClick={() => handleTabChange("services")}
          className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "services"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Services à l&apos;unité
        </button>
        <button
          onClick={() => handleTabChange("packages")}
          className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "packages"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Forfaits
        </button>
      </div>
    </div>
  );
}
