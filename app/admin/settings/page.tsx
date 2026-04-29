import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { SettingsClient } from "./settings-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Admin",
};

export default async function SettingsPage() {
  // Only DEVELOPER can access
  await requireRole("DEVELOPER");

  const settings = await prisma.setting.findMany();
  
  // Transform array of KV pairs into a Record
  const initialSettings = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
          System Settings
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Manage application-wide configuration and environment variables.
        </p>
      </div>

      <SettingsClient initialSettings={initialSettings} />
    </div>
  );
}
