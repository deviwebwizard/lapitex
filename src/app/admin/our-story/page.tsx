import prisma from "@/lib/prisma";
import { mergeAbout } from "@/lib/siteContent";
import OurStoryClient from "./OurStoryClient";
export const dynamic = "force-dynamic";
export default async function Page() { const row = await prisma.siteSetting.findUnique({ where: { key: "ABOUT_PAGE" } }); return <OurStoryClient initial={mergeAbout(row ? JSON.parse(row.value) : undefined)} />; }
