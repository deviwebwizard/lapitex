import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Activity, Clock3, History, LogIn, LogOut, Monitor, Smartphone } from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function deviceName(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  const mobile = /android|iphone|ipad|mobile/i.test(userAgent);
  const browser = /edg/i.test(userAgent) ? "Edge" : /chrome/i.test(userAgent) ? "Chrome" : /firefox/i.test(userAgent) ? "Firefox" : /safari/i.test(userAgent) ? "Safari" : "Browser";
  const operatingSystem = /windows/i.test(userAgent) ? "Windows" : /mac os|macintosh/i.test(userAgent) ? "macOS" : /android/i.test(userAgent) ? "Android" : /iphone|ipad/i.test(userAgent) ? "iOS" : /linux/i.test(userAgent) ? "Linux" : "Device";
  return `${mobile ? "Mobile" : "Desktop"} · ${operatingSystem} · ${browser}`;
}

function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date) : "Still active";
}

export default async function AdminDevicesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/login");

  const sessions = await prisma.adminSession.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { loginAt: "desc" },
    take: 100,
  });
  const latestSessions = sessions.slice(0, 15);
  const activeCutoff = new Date(Date.now() - 15 * 60 * 1000);
  const activeSessions = sessions.filter((item) => !item.logoutAt && item.lastSeenAt >= activeCutoff);
  const deviceCounts = new Map<string, number>();
  sessions.forEach((item) => deviceCounts.set(item.deviceKey, (deviceCounts.get(item.deviceKey) || 0) + 1));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2d1a26] tracking-tight">Devices</h1>
        <p className="text-sm text-[#4a1a2e]/50 font-medium mt-1">Monitor where the admin account is signed in.</p>
      </div>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-[#e1467c]" />
          <h2 className="text-lg font-black text-[#2d1a26]">Currently logged in</h2>
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">{activeSessions.length}</span>
        </div>
        {activeSessions.length === 0 ? (
          <div className="clay-card p-8 text-center text-sm font-medium text-[#4a1a2e]/50">No active admin devices found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeSessions.map((item) => (
              <div key={item.id} className="clay-card p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center"><Monitor className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <p className="font-bold text-[#2d1a26]">{deviceName(item.userAgent)}</p>
                  <p className="text-xs text-[#4a1a2e]/50 mt-1">Logged in {formatDate(item.loginAt)}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">Active · last seen {formatDate(item.lastSeenAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="clay-card p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <Smartphone className="w-5 h-5 text-[#e1467c]" />
          <h2 className="text-lg font-black text-[#2d1a26]">Device history</h2>
        </div>
        {Array.from(deviceCounts.entries()).map(([deviceKey, count]) => {
          const deviceSession = sessions.find((item) => item.deviceKey === deviceKey);
          return deviceSession ? (
            <div key={deviceKey} className="flex items-center justify-between border-t border-pink-100 py-4 first:border-t-0 first:pt-0">
              <div><p className="font-bold text-[#2d1a26]">{deviceName(deviceSession.userAgent)}</p><p className="text-xs text-[#4a1a2e]/50 mt-1">Device ID: {deviceKey.slice(0, 8)}…</p></div>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#e1467c]">{count} {count === 1 ? "login" : "logins"}</span>
            </div>
          ) : null;
        })}
        {deviceCounts.size === 0 && <p className="text-sm text-[#4a1a2e]/50">No device history yet.</p>}
      </section>

      <section className="clay-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <History className="w-5 h-5 text-[#e1467c]" />
          <h2 className="text-lg font-black text-[#2d1a26]">Last 15 admin sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-pink-100 text-[10px] uppercase tracking-widest text-[#4a1a2e]/50"><th className="pb-3 pr-4">Device</th><th className="pb-3 pr-4">Logged in</th><th className="pb-3">Logged out</th></tr></thead>
            <tbody>
              {latestSessions.map((item) => (
                <tr key={item.id} className="border-b border-pink-50 last:border-0"><td className="py-4 pr-4 font-semibold text-[#2d1a26]"><span className="flex items-center gap-2"><Monitor className="w-4 h-4 text-[#e1467c]" />{deviceName(item.userAgent)}</span></td><td className="py-4 pr-4 text-[#4a1a2e]/65"><span className="flex items-center gap-2"><LogIn className="w-4 h-4" />{formatDate(item.loginAt)}</span></td><td className={`py-4 ${item.logoutAt ? "text-[#4a1a2e]/65" : "font-semibold text-green-600"}`}><span className="flex items-center gap-2">{item.logoutAt ? <LogOut className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}{formatDate(item.logoutAt)}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        {latestSessions.length === 0 && <p className="text-sm text-[#4a1a2e]/50">No admin sessions recorded yet.</p>}
      </section>
    </div>
  );
}
