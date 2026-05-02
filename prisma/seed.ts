import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { hash } from "bcryptjs";
import ws from "ws";

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("🌱 Seeding database...");

  const existingAdmin = await prisma.user.findFirst({
    where: { role: "DEVELOPER" },
  });

  if (existingAdmin) {
    console.log("✅ Developer user already exists:", existingAdmin.email);
    return;
  }

  const email = (process.env.ADMIN_EMAIL || "admin@lakeviewvillatangalle.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name: "Admin",
      passwordHash,
      role: "DEVELOPER",
    },
  });

  console.log(`✅ Created developer user: ${user.email}`);
  console.log("⚠️  Change the default password immediately!");

  // Seed default settings
  const defaultSettings = [
    {
      key: "site.name",
      value: JSON.stringify("Lake View Villa Tangalle"),
    },
    {
      key: "site.description",
      value: JSON.stringify(
        "Private vacation rental offering panoramic lake views in Tangalle, Sri Lanka.",
      ),
    },
    {
      key: "site.contact.whatsapp",
      value: JSON.stringify("+94701164056"),
    },
    {
      key: "site.contact.email",
      value: JSON.stringify("janithsadika50@gmail.com"),
    },
    {
      key: "media.categories",
      value: JSON.stringify([
        "all",
        "indoor",
        "outdoor",
        "kitchen",
        "bedroom-1",
        "bedroom-2",
        "bathroom",
        "with-guests",
        "garden",
        "lake-view",
        "drone",
        "dining",
      ]),
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("✅ Default settings created.");
  console.log("🎉 Seed complete!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
