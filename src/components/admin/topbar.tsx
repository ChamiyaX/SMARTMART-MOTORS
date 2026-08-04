"use client";

import { Bell, Menu, Search } from "lucide-react";
import type { Role } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AdminTopbarProps = {
  title?: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  };
  onMenuClick?: () => void;
};

export function AdminTopbar({ title, user, onMenuClick }: AdminTopbarProps) {
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SM";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-[#0a0a0a]/80 px-4 backdrop-blur-xl sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="min-w-0 flex-1">
        {title ? (
          <h1 className="truncate font-display text-sm uppercase tracking-[0.15em] text-white">
            {title}
          </h1>
        ) : (
          <div className="relative hidden max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              placeholder="Search admin..."
              className="h-9 border-white/10 bg-white/[0.04] pl-9 text-white placeholder:text-white/30"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/60 hover:text-white"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="bg-primary/20 text-[10px] text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-white">{user.name}</p>
            <p className="text-[10px] text-white/40">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
