import { db, eq, Session, User } from "astro:db";

type CookieValue = { value: string } | undefined;

type CookieStore = {
    get: (name: string) => CookieValue;
    set: (
        name: string,
        value: string,
        options?: {
            path?: string;
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: "lax" | "strict" | "none";
            expires?: Date;
        },
    ) => void;
    delete: (name: string, options?: { path?: string }) => void;
};

const SESSION_COOKIE_NAME = "session_id";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export const createSession = async (cookies: CookieStore, userId: number) => {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await db.insert(Session).values({
        id: sessionId,
        userId,
        expiresAt,
    });

    cookies.set(SESSION_COOKIE_NAME, sessionId, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: expiresAt,
    });
};

export const clearSession = async (cookies: CookieStore) => {
    const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
        await db.delete(Session).where(eq(Session.id, sessionId));
    }

    cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
};

export const getCurrentUserFromCookies = async (cookies: CookieStore) => {
    const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
        return null;
    }

    const session = await db
        .select()
        .from(Session)
        .where(eq(Session.id, sessionId))
        .get();

    if (!session || session.expiresAt < new Date()) {
        await clearSession(cookies);
        return null;
    }

    return await db.select().from(User).where(eq(User.id, session.userId)).get();
};
