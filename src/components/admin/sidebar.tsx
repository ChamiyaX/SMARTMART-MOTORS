"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FolderTree,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  FileText,
  Hash,
  Info,
  LogOut,
  Mail,
  Package,
  Search,
  Settings,
  Users,
  ScrollText,
  Award,
  X,
} from "lucide-react";
import type { Role } from "@prisma/client";

import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/shared/brand-logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Award },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/home-stats", label: "Home Stats", icon: Hash },
  { href: "/admin/about", label: "About Page", icon: Info },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"] as Role[],
  },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
];

type AdminSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  };
  open?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({ user, open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SM";

  const links = navItems.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          open ? "block" : "hidden"
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="min-w-0 flex-1">
            <BrandLogo
              href="/admin"
              height={34}
              className="max-w-[150px]"
              onClick={onClose}
            />
            <p className="mt-0.5 pl-0.5 text-[10px] uppercase tracking-[0.18em] text-white/40">
              Admin Console
            </p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {links.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-primary/15 text-white shadow-[inset_3px_0_0_0_#E10600]"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-primary" : "text-white/40 group-hover:text-primary/80"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/[0.03] p-3">
            <Avatar className="h-9 w-9 border border-white/10">
              <AvatarImage src={user.image || undefined} alt={user.name || "Admin"} />
              <AvatarFallback className="bg-primary/20 text-xs text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user.name || "Admin"}
              </p>
              <p className="truncate text-[11px] text-white/40">
                {user.role.replace("_", " ")}
              </p>
            </div>
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              className="w-full border-white/10 text-white/70 hover:border-primary/40 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
