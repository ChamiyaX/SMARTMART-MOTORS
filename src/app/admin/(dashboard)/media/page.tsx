import { PageHeader } from "@/components/admin/page-header";
import { MediaUploader } from "./media-uploader";
import { DB_CONNECT_MESSAGE } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  let items: Array<{
    id: string;
    url: string;
    filename: string;
    folder: string | null;
    createdAt: Date;
  }> = [];
  let productImages: Array<{
    id: string;
    url: string;
    filename: string;
    folder: string | null;
    createdAt: Date;
  }> = [];
  let dbError: string | null = null;

  try {
    const [media, images] = await Promise.all([
      prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
        take: 60,
      }),
      prisma.productImage.findMany({
        orderBy: { createdAt: "desc" },
        take: 40,
        select: {
          id: true,
          url: true,
          alt: true,
          createdAt: true,
        },
      }),
    ]);

    items = media.map((m) => ({
      id: m.id,
      url: m.url,
      filename: m.filename,
      folder: m.folder,
      createdAt: m.createdAt,
    }));

    productImages = images.map((img) => ({
      id: `pi-${img.id}`,
      url: img.url,
      filename: img.alt || "Product image",
      folder: "products",
      createdAt: img.createdAt,
    }));
  } catch {
    dbError = DB_CONNECT_MESSAGE;
  }

  const combined = [...items, ...productImages];

  return (
    <div>
      <PageHeader
        title="Media"
        description="Upload and browse product images stored in your media library."
      />
      {dbError && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {dbError}
        </div>
      )}
      <MediaUploader items={combined} />
    </div>
  );
}
