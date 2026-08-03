import prisma from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  
  const settingsObj = settings.reduce((acc: any, setting) => {
    try {
      acc[setting.key] = JSON.parse(setting.value);
    } catch {
      acc[setting.key] = setting.value;
    }
    return acc;
  }, {});

  return <SettingsClient initialSettings={settingsObj} />;
}
