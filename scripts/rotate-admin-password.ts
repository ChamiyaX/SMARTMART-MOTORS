/**
 * Rotate the seeded admin password. Run once after deploy:
 *
 *   ADMIN_PASSWORD="YourStrongPassword123!" npm run admin:rotate-password
 */
import { config as loadEnv } from "dotenv";
import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

loadEnv({ path: ".env.local" });
loadEnv();

function getAdminPassword() {
  const value = process.env.ADMIN_PASSWORD?.trim();

  if (!value || value.length < 12) {
    console.error("Set ADMIN_PASSWORD (min 12 characters) before running this script.");
    process.exit(1);
  }

  if (value.toLowerCase() === "admin") {
    console.error('ADMIN_PASSWORD cannot be "admin". Choose a stronger password.');
    process.exit(1);
  }

  return value;
}

const prisma = new PrismaClient();

async function main() {
  const password = getAdminPassword();
  const passwordHash = await hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@smartmartmotors.com" },
    update: { passwordHash, role: Role.SUPER_ADMIN },
    create: {
      email: "admin@smartmartmotors.com",
      name: "SmartMart Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log(`Admin password updated for ${admin.email}`);
  console.log("Login with username: admin");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
