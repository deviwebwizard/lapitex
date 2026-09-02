import prisma from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  
  const typedSettings = settings as Array<{ key: string; value: string }>;
  const settingsObj: Record<string, unknown> = {};
  for (const setting of typedSettings) {
    try {
      settingsObj[setting.key] = JSON.parse(setting.value);
    } catch {
      settingsObj[setting.key] = setting.value;
    }
  }

  return <SettingsClient initialSettings={settingsObj} />;
}
