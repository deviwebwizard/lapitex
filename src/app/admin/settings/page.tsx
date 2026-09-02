import prisma from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  
  const settingsObj = settings.reduce<Record<string, unknown>>((acc, setting: { key: string; value: string }) => {
    try {
      acc[setting.key] = JSON.parse(setting.value);
    } catch {
      acc[setting.key] = setting.value;
    }
    return acc;
  }, {});

  return <SettingsClient initialSettings={settingsObj} />;
}
