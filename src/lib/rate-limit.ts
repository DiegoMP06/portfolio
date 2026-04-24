type Entry = {
    count: number;
    resetAt: number;
};

const store = new Map<string, Entry>();

const now = () => Date.now();

const cleanup = () => {
    const current = now();

    for (const [key, entry] of store.entries()) {
        if (entry.resetAt <= current) {
            store.delete(key);
        }
    }
};

export const getRequestIP = (request: Request) => {
    const forwardedFor = request.headers.get("x-forwarded-for");

    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() ?? "unknown";
    }

    return request.headers.get("x-real-ip") ?? "unknown";
};

export const enforceRateLimit = (params: {
    key: string;
    maxRequests: number;
    windowMs: number;
}) => {
    cleanup();

    const current = now();
    const entry = store.get(params.key);

    if (!entry || entry.resetAt <= current) {
        store.set(params.key, {
            count: 1,
            resetAt: current + params.windowMs,
        });
        return { ok: true as const, retryAfterMs: 0 };
    }

    if (entry.count >= params.maxRequests) {
        return {
            ok: false as const,
            retryAfterMs: Math.max(entry.resetAt - current, 0),
        };
    }

    entry.count += 1;
    store.set(params.key, entry);

    return { ok: true as const, retryAfterMs: 0 };
};
