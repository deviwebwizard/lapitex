import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, Eye, Search, ShoppingCart, Target, UserRound, Navigation, Package } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Activity = { id: string; action: string; path: string | null; query: string | null; createdAt: Date };

function readablePath(path: string | null) {
  if (!path) return "Unknown page";
  if (path === "/") return "Home";
  return path.replace(/^\//, "").replaceAll("/", " → ");
}

export default async function AdminUserActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await (prisma as any).user.findUnique({
    where: { id },
    include: {
      views: { orderBy: { viewedAt: "desc" }, include: { product: true } },
      cartItems: { include: { product: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        include: { orderItems: { include: { product: true } } },
      },
      activities: { orderBy: { createdAt: "desc" }, take: 100 },
    },
  });

  if (!user) notFound();

  const activities = user.activities as Activity[];
  const categoryScores = new Map<string, number>();
  for (const view of user.views) categoryScores.set(view.product.category, (categoryScores.get(view.product.category) || 0) + 1);
  for (const item of user.cartItems) categoryScores.set(item.product.category, (categoryScores.get(item.product.category) || 0) + 3);
  for (const order of user.orders) for (const item of order.orderItems) categoryScores.set(item.product.category, (categoryScores.get(item.product.category) || 0) + 5);
  const interests = [...categoryScores.entries()].sort((a, b) => b[1] - a[1]);

  const productInterest = new Map<string, { name: string; count: number }>();
  for (const view of user.views) {
    const current = productInterest.get(view.productId) || { name: view.product.name, count: 0 };
    current.count += 1;
    productInterest.set(view.productId, current);
  }
  for (const item of user.cartItems) {
    const current = productInterest.get(item.productId) || { name: item.product.name, count: 0 };
    current.count += 3;
    productInterest.set(item.productId, current);
  }
  const likelyProducts = [...productInterest.values()].sort((a, b) => b.count - a.count).slice(0, 5);

  const searches = activities.filter((activity) => activity.query?.toLowerCase().includes("q=")).slice(0, 15);
  const navigationCounts = new Map<string, number>();
  for (const activity of activities) navigationCounts.set(readablePath(activity.path), (navigationCounts.get(readablePath(activity.path)) || 0) + 1);
  const navigation = [...navigationCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const cards = [
    { label: "Product views", value: user.views.length, icon: Eye },
    { label: "Tracked visits", value: activities.length, icon: Navigation },
    { label: "Cart items", value: user.cartItems.length, icon: ShoppingCart },
    { label: "Orders", value: user.orders.length, icon: Package },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-[#e1467c] hover:text-[#c23066]"><ArrowLeft className="w-4 h-4" /> Back to Users</Link>

      <div className="clay-card p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg" style={{ background: "linear-gradient(135deg, #e1467c, #f472a8)" }}>{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#e1467c]">User Activity</p>
            <h1 className="text-3xl font-black text-[#2d1a26]">{user.name}</h1>
            <p className="text-sm text-[#4a1a2e]/50">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => <div key={label} className="clay-card p-5"><Icon className="w-5 h-5 text-[#e1467c] mb-3" /><p className="text-2xl font-black text-[#2d1a26]">{value}</p><p className="text-xs font-bold text-[#4a1a2e]/50">{label}</p></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="clay-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#2d1a26] mb-5"><BarChart3 className="w-5 h-5 text-[#e1467c]" /> Most interested sections</h2>
          {interests.length ? <div className="space-y-4">{interests.map(([name, score]) => <div key={name}><div className="flex justify-between text-sm font-bold text-[#2d1a26] mb-1"><span>{name}</span><span>{score} signals</span></div><div className="h-2 rounded-full bg-pink-50 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#e1467c] to-[#f472a8]" style={{ width: `${Math.min(100, score * 12)}%` }} /></div></div>)}</div> : <p className="text-sm text-[#4a1a2e]/50">Not enough activity yet.</p>}
        </section>

        <section className="clay-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#2d1a26] mb-5"><Target className="w-5 h-5 text-[#e1467c]" /> Likely interests</h2>
          {likelyProducts.length ? <div className="space-y-3">{likelyProducts.map((product) => <div key={product.name} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-pink-50/60"><span className="text-sm font-semibold text-[#2d1a26]">{product.name}</span><span className="text-xs font-black text-[#e1467c]">{product.count} signals</span></div>)}</div> : <p className="text-sm text-[#4a1a2e]/50">No product interest recorded yet.</p>}
        </section>

        <section className="clay-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#2d1a26] mb-5"><Search className="w-5 h-5 text-[#e1467c]" /> Searches</h2>
          {searches.length ? <div className="space-y-2">{searches.map((activity) => <div key={activity.id} className="flex justify-between gap-3 text-sm"><span className="font-semibold text-[#2d1a26]">{activity.query}</span><span className="text-xs text-[#4a1a2e]/40 whitespace-nowrap">{new Date(activity.createdAt).toLocaleDateString()}</span></div>)}</div> : <p className="text-sm text-[#4a1a2e]/50">No searches recorded yet.</p>}
        </section>

        <section className="clay-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#2d1a26] mb-5"><UserRound className="w-5 h-5 text-[#e1467c]" /> Navigation patterns</h2>
          {navigation.length ? <div className="space-y-3">{navigation.map(([name, count]) => <div key={name} className="flex justify-between text-sm"><span className="font-semibold text-[#2d1a26]">{name}</span><span className="font-black text-[#e1467c]">{count} visits</span></div>)}</div> : <p className="text-sm text-[#4a1a2e]/50">No navigation activity recorded yet.</p>}
        </section>
      </div>
    </div>
  );
}
