import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS_ENV = "SCHOOLCOST_ADMIN_EMAILS";

function configuredAdminEmails(): string[] {
  return (process.env[ADMIN_EMAILS_ENV] ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function hasConfiguredAdminEmails() {
  return configuredAdminEmails().length > 0;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmails = configuredAdminEmails();

  if (adminEmails.length === 0) {
    return !!email && process.env.NODE_ENV !== "production";
  }

  return !!email && adminEmails.includes(email.trim().toLowerCase());
}

export function isAdminUser(user: User | null): boolean {
  return isAdminEmail(user?.email);
}
