/**
 * lib/auth/index.ts — Re-export auth from config.ts
 * This is the canonical import point for auth in the app.
 */
export { handlers, auth, signIn, signOut } from "./config";
export { requireRole } from "./rbac";
export { hasMinRole, can, PERMISSIONS } from "./permissions";
export { requireAuth, getSession, hasRole } from "./helpers";
