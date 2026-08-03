import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-black text-primary">Admin Panel</h2>
        </div>
        <div className="p-4 flex-grow">
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span>Orders</span>
            </Link>
            <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <header className="bg-white border-b border-border p-4 flex justify-between items-center md:hidden">
           <h2 className="text-xl font-black text-primary">Admin Panel</h2>
           {/* Mobile menu button could go here */}
        </header>
        <div className="p-6 md:p-8 flex-grow overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
