import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Award, FolderTree, Mail, Package, ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const [
      productCount,
      categoryCount,
      brandCount,
      newMessages,
      recentMessages,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.message.count({ where: { status: "NEW" } }),
      prisma.message.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          brand: { select: { name: true } },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      }),
    ]);

    return {
      productCount,
      categoryCount,
      brandCount,
      newMessages,
      recentMessages,
      recentProducts,
      dbError: null as string | null,
    };
  } catch {
    return {
      productCount: 0,
      categoryCount: 0,
      brandCount: 0,
      newMessages: 0,
      recentMessages: [],
      recentProducts: [],
      dbError: DB_CONNECT_MESSAGE,
    };
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of inventory, inquiries, and catalog activity."
      />

      {data.dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {data.dbError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Products"
          value={data.productCount}
          icon={Package}
          description="Total catalog items"
        />
        <StatCard
          title="Categories"
          value={data.categoryCount}
          icon={FolderTree}
          description="Active taxonomy"
        />
        <StatCard
          title="Brands"
          value={data.brandCount}
          icon={Award}
          description="Partner brands"
        />
        <StatCard
          title="New Messages"
          value={data.newMessages}
          icon={Mail}
          description="Awaiting response"
          trend={data.newMessages > 0 ? "Action needed" : undefined}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-white">
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentMessages.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/40">No messages yet</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.recentMessages.map((msg) => (
                <li key={msg.id}>
                  <Link
                    href={`/admin/messages/${msg.id}`}
                    className="flex items-start justify-between gap-3 py-3 transition hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">{msg.subject}</p>
                      <p className="mt-0.5 truncate text-xs text-white/40">
                        {msg.name} · {msg.email}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={
                          msg.status === "NEW"
                            ? "border-primary/40 text-primary"
                            : "border-white/15 text-white/50"
                        }
                      >
                        {msg.status}
                      </Badge>
                      <span className="text-[10px] text-white/30">
                        {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-white">
              Recent Products
            </h2>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentProducts.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/40">No products yet</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.recentProducts.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex items-center justify-between gap-3 py-3 transition hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">{product.name}</p>
                      <p className="mt-0.5 text-xs text-white/40">
                        {product.brand.name} · {product.sku}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm text-primary">
                      {formatPrice(Number(product.price))}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
