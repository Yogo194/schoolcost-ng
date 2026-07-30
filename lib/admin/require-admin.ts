import { isAdminUser } from "@/lib/admin/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function requireAdminUser(): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    throw new Error("Admin access required");
  }
}
