import prisma from "@/lib/prisma";
import { mergeContact } from "@/lib/siteContent";
import ContactClient from "./ContactClient";
export const dynamic = "force-dynamic";
export default async function Page() { const row = await prisma.siteSetting.findUnique({ where: { key: "CONTACT_INFO" } }); return <ContactClient initial={mergeContact(row ? JSON.parse(row.value) : undefined)} />; }
