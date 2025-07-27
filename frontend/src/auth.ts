import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import { Lucia } from "lucia";
import prisma from "./lib/prisma";

const adapter = new PrismaAdapter(prisma?.session!, prisma?.user!);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(DatabaseUser) {
    return {
      id: DatabaseUser.id,
      username: DatabaseUser.username,
      displayName: DatabaseUser.displayName,
      avatarUrl: DatabaseUser.avatarUrl,
      googleId: DatabaseUser.googleId,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
);

