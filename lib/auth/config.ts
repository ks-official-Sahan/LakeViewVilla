import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { JWTSessionError } from "@auth/core/errors";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import type { Role } from "@prisma/client";

/** Session JWT decrypt tries each secret in order (encode uses the first). */
function resolveAuthSecret(): string | string[] | undefined {
  const chain: string[] = [];
  const push = (value: string | undefined) => {
    const v = value?.trim();
    if (v && !chain.includes(v)) chain.push(v);
  };
  push(process.env.AUTH_SECRET);
  push(process.env.NEXTAUTH_SECRET);
  push(process.env.AUTH_SECRET_PREVIOUS);
  if (chain.length === 0) return undefined;
  if (chain.length === 1) return chain[0];
  return chain;
}

declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: Role;
      avatar: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: resolveAuthSecret(),
  logger: {
    error(error) {
      // Stale session cookie after AUTH_SECRET change / env reload — Auth.js clears cookies; avoid SSR noise.
      if (error instanceof JWTSessionError) return;
      const name =
        error instanceof Error && "type" in error
          ? String((error as { type?: string }).type)
          : error instanceof Error
            ? error.name
            : "Error";
      console.error(`[auth][error] ${name}: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error && error.cause instanceof Error) {
        console.error("[auth][cause]:", error.cause.stack ?? error.cause.message);
      }
    },
  },
  /**
   * Avoid UntrustedHost when `AUTH_URL` / `NEXTAUTH_URL` does not match the browser origin
   * (e.g. production URL in env while using http://localhost:3000). Without this, `/api/auth/session`
   * fails and admin SSR can break or appear blank until cookies/host align.
   * Set `AUTH_TRUST_HOST=false` only if you intentionally enforce strict host checks.
   */
  trustHost: process.env.AUTH_TRUST_HOST !== "false",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();

        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
