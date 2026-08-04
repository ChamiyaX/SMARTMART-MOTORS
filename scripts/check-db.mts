import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count({ where: { isActive: true } });
  const featured = await prisma.product.count({
    where: { isActive: true, isFeatured: true },
  });
  console.log(JSON.stringify({ ok: true, products: count, featured }, null, 2));
}

main()
  .catch((e) => {
    console.error("FAIL", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
