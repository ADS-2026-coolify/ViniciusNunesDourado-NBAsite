import React from "react";
import { fetchNba } from "@/lib/api";
import type { OverviewResponse } from "@/lib/types";
import { LandingClient } from "@/components/LandingClient";

export default async function HomePage() {
  let initialData: OverviewResponse | null = null;
  try {
    initialData = await fetchNba<OverviewResponse>("/overview");
  } catch {
    initialData = null;
  }

  return <LandingClient initialData={initialData} />;
}
