/**
 * lib/auth/index.ts — Re-export auth from config.ts
 * This is the canonical import point for auth in the app.
 */
export { handlers, auth, signIn, signOut } from "./config";
export { requireRole, hasMinRole, can, PERMISSIONS } from "./rbac";
export { requireAuth, getSession, hasRole } from "./helpers";
