import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthRedirect() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  } else if (session?.user && (session.user as any).role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/account");
  }
}
