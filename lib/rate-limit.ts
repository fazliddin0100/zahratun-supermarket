// lib/rate-limit.ts
interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export default function rateLimit(options: RateLimitOptions) {
  const tokens = new Map();

  return {
    check: (limit: number, uniqueToken: string) => {
      const now = Date.now();
      const interval = options.interval;

      if (!tokens.has(uniqueToken)) {
        tokens.set(uniqueToken, {
          count: 1,
          lastReset: now,
        });
      } else {
        const tokenData = tokens.get(uniqueToken);

        // Agar interval o'tgan bo'lsa, reset qilish
        if (now - tokenData.lastReset > interval) {
          tokenData.count = 1;
          tokenData.lastReset = now;
        } else {
          tokenData.count += 1;
        }

        // Limit tekshirish
        if (tokenData.count > limit) {
          throw new Error('Rate limit exceeded');
        }
      }

      // Eski tokenlarni tozalash
      tokens.forEach((value, key) => {
        if (now - value.lastReset > interval * 2) {
          tokens.delete(key);
        }
      });
    },
  };
}
