import prisma from "@/lib/prisma";

const MAX_REQUESTS = 2;
const WINDOW_MS = 60 * 1000;
const BLOCK_THRESHOLD = 15;
const TOTAL_WINDOW_MS = 15 * 60 * 1000;
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000;

function getTrustedIp(request: Request): string | null {
  const value = request.headers.get("x-real-ip")?.trim();
  return value && /^[a-f0-9:.]+$/i.test(value) ? value : null;
}

export async function isPasswordResetRateLimited(request: Request, email: string): Promise<boolean> {
  const keys = [`email:${email.toLowerCase()}`];
  const ip = getTrustedIp(request);
  if (ip) keys.push(`ip:${ip}`);

  const now = Date.now();
  for (const key of keys) {
    const limited = await prisma.$transaction(async (tx: Pick<typeof prisma, "authRateLimit">) => {
      const current = await tx.authRateLimit.findUnique({ where: { key } });
      const windowExpired = !current || now - current.windowStartedAt.getTime() >= WINDOW_MS;
      const totalWindowExpired = !current || now - current.totalWindowStartedAt.getTime() >= TOTAL_WINDOW_MS;

      if (current?.blockedUntil && current.blockedUntil.getTime() > now) return true;

      const nextCount = windowExpired ? 1 : current.count + 1;
      const nextTotalCount = totalWindowExpired ? 1 : current.totalCount + 1;
      const blockedUntil = nextTotalCount >= BLOCK_THRESHOLD
        ? new Date(now + BLOCK_DURATION_MS)
        : null;

      await tx.authRateLimit.upsert({
        where: { key },
        update: {
          count: nextCount,
          windowStartedAt: windowExpired ? new Date(now) : current.windowStartedAt,
          totalCount: nextTotalCount,
          totalWindowStartedAt: totalWindowExpired ? new Date(now) : current.totalWindowStartedAt,
          blockedUntil,
        },
        create: {
          key,
          count: 1,
          windowStartedAt: new Date(now),
          totalCount: 1,
          totalWindowStartedAt: new Date(now),
        },
      });

      return nextCount > MAX_REQUESTS || Boolean(blockedUntil);
    });

    if (limited) return true;
  }

  return false;
}
