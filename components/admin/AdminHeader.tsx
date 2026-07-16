"use client";

import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
      <p className="text-sm font-medium text-gray-700">Admin</p>
      <div className="flex items-center gap-4">
        <p className="text-xs text-gray-400 hidden sm:block">{user.email}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="gap-2 text-gray-600"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
