import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNavigation } from "./AdminNavigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'linear-gradient(135deg, #fdf2f6 0%, #fce4ec 30%, #fdf2f6 60%, #fff 100%)' }}>
      
      {/* Navigation (Sidebar on Desktop, Top Bar + Drawer on Mobile) */}
      <AdminNavigation user={{ name: session.user?.name, email: session.user?.email }} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
