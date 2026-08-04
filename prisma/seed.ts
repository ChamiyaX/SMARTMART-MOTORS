import { config as loadEnv } from "dotenv";
import {
  PrismaClient,
  Role,
  StockStatus,
  type Brand,
  type Category,
} from "@prisma/client";
import { hash } from "bcryptjs";

loadEnv({ path: ".env.local" });
loadEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the seed script");
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SmartMart Motors database...");

  const passwordHash = await hash("admin", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@smartmartmotors.com" },
    update: {
      name: "SmartMart Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: "admin@smartmartmotors.com",
      name: "SmartMart Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log(`✓ Admin user: ${admin.email} (login: admin / admin)`);

  const categoryData = [
    {
      name: "Engine Parts",
      slug: "engine-parts",
      description:
        "Pistons, gaskets, timing components, and precision engine parts imported from China for Japanese and Korean vehicles.",
      sortOrder: 1,
      seoTitle: "Engine Parts Sri Lanka | SmartMart Motors",
      seoDescription:
        "Shop genuine imported Chinese OEM engine spare parts for Toyota, Honda, Nissan and more in Sri Lanka.",
    },
    {
      name: "Brake System",
      slug: "brake-system",
      description:
        "Brake pads, discs, shoes, master cylinders, and hydraulic components built to OEM specifications.",
      sortOrder: 2,
      seoTitle: "Brake Parts Sri Lanka | SmartMart Motors",
      seoDescription:
        "Premium brake pads, rotors and brake system spare parts at wholesale-friendly prices.",
    },
    {
      name: "Suspension",
      slug: "suspension",
      description:
        "Shock absorbers, control arms, bushings, ball joints and complete suspension kits.",
      sortOrder: 3,
      seoTitle: "Suspension Parts Sri Lanka | SmartMart Motors",
      seoDescription:
        "KYB-compatible and OEM-quality suspension parts for passenger cars and vans.",
    },
    {
      name: "Electrical",
      slug: "electrical",
      description:
        "Alternators, starters, sensors, ignition coils, wiring and electrical assemblies.",
      sortOrder: 4,
      seoTitle: "Auto Electrical Parts Sri Lanka | SmartMart Motors",
      seoDescription:
        "Reliable automotive electrical spare parts imported for Sri Lankan workshops.",
    },
    {
      name: "Body Parts",
      slug: "body-parts",
      description:
        "Bumpers, grilles, mirrors, fenders and cosmetic body components for popular models.",
      sortOrder: 5,
      seoTitle: "Car Body Parts Sri Lanka | SmartMart Motors",
      seoDescription:
        "Imported body panels and accessories for Japanese and Korean vehicle platforms.",
    },
    {
      name: "Filters",
      slug: "filters",
      description:
        "Oil, air, cabin and fuel filters for scheduled maintenance and fleet service.",
      sortOrder: 6,
      seoTitle: "Car Filters Sri Lanka | SmartMart Motors",
      seoDescription:
        "OEM-quality oil, air, cabin and fuel filters for all major brands.",
    },
    {
      name: "Lighting",
      slug: "lighting",
      description:
        "Headlamps, LED assemblies, indicators, fog lamps and lighting accessories.",
      sortOrder: 7,
      seoTitle: "Auto Lighting Sri Lanka | SmartMart Motors",
      seoDescription:
        "Headlights, LED lamps and auto lighting spare parts for Sri Lankan roads.",
    },
    {
      name: "Transmission",
      slug: "transmission",
      description: "Clutch kits, mounts, CV joints, axles and drivetrain components.",
      sortOrder: 8,
      seoTitle: "Transmission Parts Sri Lanka | SmartMart Motors",
      seoDescription:
        "Clutch kits, CV joints and transmission spare parts from trusted Chinese OEMs.",
    },
  ];

  const categories: Category[] = [];
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(created);
  }

  console.log(`✓ ${categories.length} categories`);

  const brandData = [
    {
      name: "OEM China Parts",
      slug: "oem-china-parts",
      description:
        "Genuine factory-grade spare parts manufactured in China to exact OEM specifications for Japanese and Korean vehicles.",
      website: null,
      sortOrder: 1,
      logo: "https://picsum.photos/seed/oem-china/200/200",
    },
    {
      name: "Bosch Compatible",
      slug: "bosch-compatible",
      description:
        "Bosch-spec compatible ignition, fuel and sensor components sourced from certified Chinese manufacturers.",
      website: null,
      sortOrder: 2,
      logo: "https://picsum.photos/seed/bosch-compat/200/200",
    },
    {
      name: "Denso Compatible",
      slug: "denso-compatible",
      description:
        "Denso-compatible spark plugs, filters and electrical parts imported from China for reliable performance.",
      website: null,
      sortOrder: 3,
      logo: "https://picsum.photos/seed/denso-compat/200/200",
    },
    {
      name: "KYB",
      slug: "kyb",
      description:
        "KYB and KYB-compatible shock absorbers and suspension modules for Sri Lankan road conditions.",
      website: "https://www.kyb.com",
      sortOrder: 4,
      logo: "https://picsum.photos/seed/kyb/200/200",
    },
    {
      name: "NGK",
      slug: "ngk",
      description:
        "NGK and compatible spark plugs and ignition components for petrol engines.",
      website: "https://www.ngk.com",
      sortOrder: 5,
      logo: "https://picsum.photos/seed/ngk/200/200",
    },
    {
      name: "Bando",
      slug: "bando",
      description:
        "Bando timing belts, ribbed belts and drive belt kits for everyday passenger vehicles.",
      website: "https://www.bandogrp.com",
      sortOrder: 6,
      logo: "https://picsum.photos/seed/bando/200/200",
    },
    {
      name: "Gates",
      slug: "gates",
      description:
        "Gates-compatible belts, tensioners and cooling system hoses for workshop fitment.",
      website: "https://www.gates.com",
      sortOrder: 7,
      logo: "https://picsum.photos/seed/gates/200/200",
    },
    {
      name: "Aisin",
      slug: "aisin",
      description:
        "Aisin-compatible water pumps, clutches and transmission components imported from China.",
      website: "https://www.aisin.com",
      sortOrder: 8,
      logo: "https://picsum.photos/seed/aisin/200/200",
    },
  ];

  const brands: Brand[] = [];
  for (const brand of brandData) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
    brands.push(created);
  }

  console.log(`✓ ${brands.length} brands`);

  const cat = (slug: string) => {
    const found = categories.find((c) => c.slug === slug);
    if (!found) throw new Error(`Category missing: ${slug}`);
    return found;
  };

  const brand = (slug: string) => {
    const found = brands.find((b) => b.slug === slug);
    if (!found) throw new Error(`Brand missing: ${slug}`);
    return found;
  };

  const products = [
    {
      name: "OEM Front Brake Pads – Toyota Vitz / Yaris",
      slug: "oem-front-brake-pads-toyota-vitz",
      sku: "SM-BP-TV-001",
      description:
        "Ceramic compound front brake pads manufactured in China to OEM dimensions for Toyota Vitz and Yaris platforms.",
      richDescription:
        "<p>High-friction ceramic pads with anti-noise shims. Direct bolt-on fitment for KSP90 / NCP91 applications.</p>",
      price: 8500,
      compareAtPrice: 10500,
      discount: 19.05,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 48,
      isFeatured: true,
      isNewArrival: true,
      isPopular: true,
      categoryId: cat("brake-system").id,
      brandId: brand("oem-china-parts").id,
      metaTitle: "Toyota Vitz Front Brake Pads | SmartMart Motors",
      metaDescription:
        "OEM-quality Chinese front brake pads for Toyota Vitz / Yaris. In stock island-wide shipping.",
      specifications: {
        position: "Front",
        compound: "Ceramic",
        pieces: 4,
        warranty: "6 months",
      },
      compatibleModels: ["Toyota Vitz", "Toyota Yaris", "Toyota Belta"],
      tags: ["brakes", "toyota", "oem"],
      images: [
        {
          url: "https://picsum.photos/seed/brake-pads-1/800/800",
          alt: "Toyota Vitz front brake pads",
          sortOrder: 0,
          isPrimary: true,
        },
        {
          url: "https://picsum.photos/seed/brake-pads-2/800/800",
          alt: "Brake pad packaging",
          sortOrder: 1,
          isPrimary: false,
        },
      ],
    },
    {
      name: "KYB Front Shock Absorber – Honda Fit GE6",
      slug: "kyb-front-shock-honda-fit-ge6",
      sku: "SM-SA-HF-002",
      description:
        "Gas-charged front shock absorber compatible with Honda Fit GE6/GE8, tuned for Sri Lankan road surfaces.",
      richDescription:
        "<p>Precise damping control with sealed gas chamber. Sold per unit; recommend replacing in axle pairs.</p>",
      price: 18500,
      compareAtPrice: 22000,
      discount: 15.91,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 22,
      isFeatured: true,
      isNewArrival: false,
      isPopular: true,
      categoryId: cat("suspension").id,
      brandId: brand("kyb").id,
      metaTitle: "KYB Honda Fit Shock Absorber | SmartMart Motors",
      metaDescription:
        "KYB-compatible front shock for Honda Fit GE6/GE8. Premium import stock.",
      specifications: {
        position: "Front",
        type: "Gas",
        side: "Left/Right shared",
      },
      compatibleModels: ["Honda Fit GE6", "Honda Fit GE8", "Honda Jazz GE"],
      tags: ["suspension", "honda", "kyb"],
      images: [
        {
          url: "https://picsum.photos/seed/shock-kyb/800/800",
          alt: "KYB front shock absorber",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "NGK Iridium Spark Plug Set – Nissan March",
      slug: "ngk-iridium-spark-plugs-nissan-march",
      sku: "SM-SP-NM-003",
      description:
        "Set of 3 NGK-compatible iridium spark plugs for Nissan March / Micra HR12DE engines.",
      price: 7200,
      compareAtPrice: 8900,
      discount: 19.1,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 60,
      isFeatured: true,
      isNewArrival: true,
      isPopular: false,
      categoryId: cat("electrical").id,
      brandId: brand("ngk").id,
      metaTitle: "NGK Spark Plugs Nissan March | SmartMart Motors",
      metaDescription:
        "Iridium spark plug set for Nissan March. Smooth idle and fuel economy.",
      specifications: { gap: "0.8mm", quantity: 3, tip: "Iridium" },
      compatibleModels: ["Nissan March K13", "Nissan Micra", "Renault Pulse"],
      tags: ["ignition", "nissan", "ngk"],
      images: [
        {
          url: "https://picsum.photos/seed/spark-plugs/800/800",
          alt: "NGK iridium spark plugs",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Bando Timing Belt Kit – Suzuki Wagon R",
      slug: "bando-timing-belt-kit-suzuki-wagon-r",
      sku: "SM-TB-SW-004",
      description:
        "Complete Bando timing belt kit with tensioner for Suzuki Wagon R K6A / K10B applications.",
      price: 14500,
      compareAtPrice: 16800,
      discount: 13.69,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 18,
      isFeatured: false,
      isNewArrival: true,
      isPopular: true,
      categoryId: cat("engine-parts").id,
      brandId: brand("bando").id,
      metaTitle: "Suzuki Wagon R Timing Belt Kit | SmartMart Motors",
      metaDescription: "Bando timing belt kit for Suzuki Wagon R. Includes tensioner.",
      specifications: {
        includes: ["Belt", "Tensioner"],
        engine: "K6A / K10B",
      },
      compatibleModels: ["Suzuki Wagon R", "Suzuki Stingray", "Suzuki Alto"],
      tags: ["timing", "suzuki", "bando"],
      images: [
        {
          url: "https://picsum.photos/seed/timing-belt/800/800",
          alt: "Bando timing belt kit",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Aisin Water Pump – Toyota Aqua / Prius C",
      slug: "aisin-water-pump-toyota-aqua",
      sku: "SM-WP-TA-005",
      description:
        "Aisin-compatible mechanical water pump for Toyota Aqua and Prius C hybrid cooling circuits.",
      price: 16500,
      compareAtPrice: 19500,
      discount: 15.38,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 14,
      isFeatured: true,
      isNewArrival: false,
      isPopular: true,
      categoryId: cat("engine-parts").id,
      brandId: brand("aisin").id,
      metaTitle: "Toyota Aqua Water Pump Aisin | SmartMart Motors",
      metaDescription:
        "OEM-spec water pump for Toyota Aqua / Prius C. Chinese OEM import.",
      specifications: { driven: "Belt", gasketIncluded: true },
      compatibleModels: ["Toyota Aqua", "Toyota Prius C", "Toyota Yaris Hybrid"],
      tags: ["cooling", "toyota", "aisin"],
      images: [
        {
          url: "https://picsum.photos/seed/water-pump/800/800",
          alt: "Aisin water pump",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Gates Multi-Rib Serpentine Belt – Mitsubishi Lancer",
      slug: "gates-serpentine-belt-mitsubishi-lancer",
      sku: "SM-SB-ML-006",
      description:
        "Gates-compatible EPDM multi-rib belt for Mitsubishi Lancer accessory drive.",
      price: 4800,
      compareAtPrice: 5600,
      discount: 14.29,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 35,
      isFeatured: false,
      isNewArrival: false,
      isPopular: true,
      categoryId: cat("engine-parts").id,
      brandId: brand("gates").id,
      metaTitle: "Mitsubishi Lancer Serpentine Belt | SmartMart Motors",
      metaDescription: "Gates-compatible serpentine belt for Mitsubishi Lancer models.",
      specifications: { ribs: 6, lengthMm: 1895 },
      compatibleModels: ["Mitsubishi Lancer", "Mitsubishi Galant Fortis"],
      tags: ["belt", "mitsubishi", "gates"],
      images: [
        {
          url: "https://picsum.photos/seed/serpentine/800/800",
          alt: "Serpentine drive belt",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Denso Compatible Cabin Filter – Honda Vezel",
      slug: "denso-cabin-filter-honda-vezel",
      sku: "SM-CF-HV-007",
      description:
        "Activated carbon cabin air filter for Honda Vezel / HR-V – Denso-compatible Chinese OEM.",
      price: 3200,
      compareAtPrice: 3900,
      discount: 17.95,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 80,
      isFeatured: false,
      isNewArrival: true,
      isPopular: false,
      categoryId: cat("filters").id,
      brandId: brand("denso-compatible").id,
      metaTitle: "Honda Vezel Cabin Filter | SmartMart Motors",
      metaDescription:
        "Carbon cabin filter for Honda Vezel / HR-V. Fast Colombo delivery.",
      specifications: { media: "Carbon", layers: 3 },
      compatibleModels: ["Honda Vezel", "Honda HR-V", "Honda XRV"],
      tags: ["filter", "honda", "cabin"],
      images: [
        {
          url: "https://picsum.photos/seed/cabin-filter/800/800",
          alt: "Cabin air filter",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Bosch Compatible Alternator – Hyundai i10",
      slug: "bosch-compatible-alternator-hyundai-i10",
      sku: "SM-AL-HI-008",
      description:
        "Reman-quality 90A alternator built to Bosch electrical specs for Hyundai i10 / Kia Picanto.",
      price: 28500,
      compareAtPrice: 34000,
      discount: 16.18,
      stockStatus: StockStatus.LOW_STOCK,
      stockQuantity: 5,
      isFeatured: true,
      isNewArrival: false,
      isPopular: true,
      categoryId: cat("electrical").id,
      brandId: brand("bosch-compatible").id,
      metaTitle: "Hyundai i10 Alternator | SmartMart Motors",
      metaDescription:
        "Bosch-compatible alternator for Hyundai i10. Tested and ready to fit.",
      specifications: { amps: 90, voltage: 12, pulley: "Clutch" },
      compatibleModels: ["Hyundai i10", "Kia Picanto", "Hyundai Grand i10"],
      tags: ["alternator", "hyundai", "electrical"],
      images: [
        {
          url: "https://picsum.photos/seed/alternator/800/800",
          alt: "Automotive alternator",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "OEM LED Headlight Assembly – Suzuki Alto",
      slug: "oem-led-headlight-suzuki-alto",
      sku: "SM-HL-SA-009",
      description:
        "Left-side LED projector headlight assembly for Suzuki Alto – Chinese OEM housing with clear lens.",
      price: 24500,
      compareAtPrice: 28900,
      discount: 15.22,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 9,
      isFeatured: false,
      isNewArrival: true,
      isPopular: false,
      categoryId: cat("lighting").id,
      brandId: brand("oem-china-parts").id,
      metaTitle: "Suzuki Alto LED Headlight | SmartMart Motors",
      metaDescription:
        "OEM-style LED headlight for Suzuki Alto. Left side, plug-and-play.",
      specifications: {
        side: "Left (LH)",
        technology: "LED",
        homologation: "E-mark compatible",
      },
      compatibleModels: ["Suzuki Alto HA36", "Suzuki Alto Lapin"],
      tags: ["lighting", "suzuki", "headlight"],
      images: [
        {
          url: "https://picsum.photos/seed/headlight/800/800",
          alt: "Suzuki Alto headlight assembly",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Aisin Clutch Kit – Toyota Axio / Allion",
      slug: "aisin-clutch-kit-toyota-axio",
      sku: "SM-CK-TA-010",
      description:
        "Complete Aisin-compatible clutch kit: disc, cover and release bearing for Toyota Axio / Allion NZE141.",
      price: 32500,
      compareAtPrice: 38500,
      discount: 15.58,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 11,
      isFeatured: true,
      isNewArrival: false,
      isPopular: true,
      categoryId: cat("transmission").id,
      brandId: brand("aisin").id,
      metaTitle: "Toyota Axio Clutch Kit | SmartMart Motors",
      metaDescription:
        "Full clutch kit for Toyota Axio / Allion. Aisin-compatible Chinese OEM.",
      specifications: {
        includes: ["Disc", "Cover", "Release bearing"],
        diameterMm: 215,
      },
      compatibleModels: ["Toyota Axio", "Toyota Allion", "Toyota Fielder"],
      tags: ["clutch", "toyota", "transmission"],
      images: [
        {
          url: "https://picsum.photos/seed/clutch-kit/800/800",
          alt: "Toyota clutch kit",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "OEM Front Bumper – Nissan Sunny N17",
      slug: "oem-front-bumper-nissan-sunny-n17",
      sku: "SM-BB-NS-011",
      description:
        "Unpainted front bumper cover for Nissan Sunny / Almera N17 – OEM China moulding.",
      price: 19800,
      compareAtPrice: 24500,
      discount: 19.18,
      stockStatus: StockStatus.PRE_ORDER,
      stockQuantity: 0,
      isFeatured: false,
      isNewArrival: true,
      isPopular: false,
      categoryId: cat("body-parts").id,
      brandId: brand("oem-china-parts").id,
      metaTitle: "Nissan Sunny Front Bumper | SmartMart Motors",
      metaDescription: "Front bumper cover for Nissan Sunny N17. Pre-order available.",
      specifications: { finish: "Unpainted primer", clipsIncluded: false },
      compatibleModels: ["Nissan Sunny N17", "Nissan Almera N17"],
      tags: ["body", "nissan", "bumper"],
      images: [
        {
          url: "https://picsum.photos/seed/bumper/800/800",
          alt: "Nissan Sunny front bumper",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Denso Compatible Oil Filter – Multi Fit Japanese",
      slug: "denso-oil-filter-multi-fit",
      sku: "SM-OF-MF-012",
      description:
        "Spin-on oil filter covering popular Toyota, Honda and Nissan petrol engines – Denso-compatible media.",
      price: 1450,
      compareAtPrice: 1800,
      discount: 19.44,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 200,
      isFeatured: false,
      isNewArrival: false,
      isPopular: true,
      categoryId: cat("filters").id,
      brandId: brand("denso-compatible").id,
      metaTitle: "Universal Japanese Oil Filter | SmartMart Motors",
      metaDescription:
        "Affordable Denso-compatible oil filter for Japanese engines. Bulk pricing available.",
      specifications: { thread: "M20x1.5", bypassValve: true },
      compatibleModels: ["Toyota 1NZ", "Honda L15", "Nissan HR12", "Suzuki K10"],
      tags: ["filter", "oil", "maintenance"],
      images: [
        {
          url: "https://picsum.photos/seed/oil-filter/800/800",
          alt: "Spin-on oil filter",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "KYB Rear Shock Pair – Mitsubishi Mirage",
      slug: "kyb-rear-shock-pair-mitsubishi-mirage",
      sku: "SM-SA-MM-013",
      description:
        "Pair of KYB-compatible rear shock absorbers for Mitsubishi Mirage / Attrage.",
      price: 26800,
      compareAtPrice: 31000,
      discount: 13.55,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 8,
      isFeatured: true,
      isNewArrival: false,
      isPopular: false,
      categoryId: cat("suspension").id,
      brandId: brand("kyb").id,
      metaTitle: "Mitsubishi Mirage Rear Shocks | SmartMart Motors",
      metaDescription: "KYB-compatible rear shock pair for Mitsubishi Mirage / Attrage.",
      specifications: { quantity: 2, position: "Rear", type: "Gas" },
      compatibleModels: [
        "Mitsubishi Mirage",
        "Mitsubishi Attrage",
        "Mitsubishi Space Star",
      ],
      tags: ["suspension", "mitsubishi", "kyb"],
      images: [
        {
          url: "https://picsum.photos/seed/rear-shocks/800/800",
          alt: "Rear shock absorber pair",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
    {
      name: "Bosch Compatible Brake Disc Pair – Honda Grace",
      slug: "bosch-brake-disc-honda-grace",
      sku: "SM-BD-HG-014",
      description:
        "Ventilated front brake disc pair, Bosch-dimension compatible for Honda Grace / City GM.",
      price: 15200,
      compareAtPrice: 17800,
      discount: 14.61,
      stockStatus: StockStatus.OUT_OF_STOCK,
      stockQuantity: 0,
      isFeatured: false,
      isNewArrival: false,
      isPopular: true,
      categoryId: cat("brake-system").id,
      brandId: brand("bosch-compatible").id,
      metaTitle: "Honda Grace Brake Discs | SmartMart Motors",
      metaDescription:
        "Front ventilated brake discs for Honda Grace / City. Restocking soon.",
      specifications: { diameterMm: 262, ventilated: true, quantity: 2 },
      compatibleModels: ["Honda Grace", "Honda City GM", "Honda Jazz GK"],
      tags: ["brakes", "honda", "discs"],
      images: [
        {
          url: "https://picsum.photos/seed/brake-disc/800/800",
          alt: "Brake disc pair",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
    },
  ];

  for (const product of products) {
    const { images, ...productData } = product;
    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        ...productData,
        images: {
          deleteMany: {},
          create: images,
        },
      },
      create: {
        ...productData,
        images: {
          create: images,
        },
      },
    });
    console.log(`  · Product: ${created.sku}`);
  }

  console.log(`✓ ${products.length} products`);

  const settings = [
    {
      key: "company",
      group: "general",
      value: {
        name: "SmartMart Motors",
        tagline: "Premium Automotive Spare Parts – Sri Lanka",
        address: "Colombo, Sri Lanka",
        phone: "0775475141",
        email: "smartmartmotors@gmail.com",
        whatsapp: "94775475141",
        registration: "",
      },
    },
    {
      key: "social",
      group: "general",
      value: {
        facebook: "https://facebook.com/smartmartmotors",
        instagram: "https://instagram.com/smartmartmotors",
        youtube: "",
        tiktok: "",
        linkedin: "",
      },
    },
    {
      key: "business_hours",
      group: "general",
      value: {
        monday: "08:30 – 18:00",
        tuesday: "08:30 – 18:00",
        wednesday: "08:30 – 18:00",
        thursday: "08:30 – 18:00",
        friday: "08:30 – 18:00",
        saturday: "08:30 – 16:00",
        sunday: "Closed",
        note: "Island-wide delivery available",
      },
    },
    {
      key: "analytics",
      group: "integrations",
      value: {
        googleAnalyticsId: "",
        googleTagManagerId: "",
        facebookPixelId: "",
        clarityId: "",
      },
    },
    {
      key: "seo",
      group: "seo",
      value: {
        defaultTitle: "SmartMart Motors | Premium Auto Spare Parts Sri Lanka",
        titleTemplate: "%s | SmartMart Motors",
        defaultDescription:
          "Imported Chinese OEM-quality automotive spare parts for Toyota, Honda, Nissan, Suzuki and more. Colombo-based, island-wide delivery.",
        ogImage: "/og-default.jpg",
      },
    },
    {
      key: "shipping",
      group: "commerce",
      value: {
        freeShippingThreshold: 15000,
        defaultCourier: "Local courier",
        estimateDays: "1–3 business days within Colombo",
      },
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, group: setting.group },
      create: setting,
    });
  }

  console.log(`✓ ${settings.length} settings`);

  await prisma.pageContent.upsert({
    where: { page: "home" },
    update: {
      title: "SmartMart Motors – Premium Auto Parts",
      isPublished: true,
      seoTitle: "SmartMart Motors | Premium Automotive Spare Parts Sri Lanka",
      seoDescription:
        "Shop OEM-quality Chinese imported spare parts for Japanese and Korean vehicles. Brake, engine, suspension, electrical and more.",
      content: {
        hero: {
          headline: "Precision Parts. Trusted Supply.",
          subheadline:
            "Genuine imported Chinese OEM components for Sri Lanka’s workshops and vehicle owners.",
          ctaPrimary: "Browse catalogue",
          ctaSecondary: "WhatsApp inquiry",
        },
        features: [
          {
            title: "OEM-grade imports",
            description: "Direct from certified Chinese manufacturers",
          },
          {
            title: "Fast island delivery",
            description: "Colombo same-day options available",
          },
          {
            title: "Workshop support",
            description: "Fitment guidance from specialists",
          },
        ],
      },
    },
    create: {
      page: "home",
      title: "SmartMart Motors – Premium Auto Parts",
      isPublished: true,
      seoTitle: "SmartMart Motors | Premium Automotive Spare Parts Sri Lanka",
      seoDescription:
        "Shop OEM-quality Chinese imported spare parts for Japanese and Korean vehicles. Brake, engine, suspension, electrical and more.",
      content: {
        hero: {
          headline: "Precision Parts. Trusted Supply.",
          subheadline:
            "Genuine imported Chinese OEM components for Sri Lanka’s workshops and vehicle owners.",
          ctaPrimary: "Browse catalogue",
          ctaSecondary: "WhatsApp inquiry",
        },
        features: [
          {
            title: "OEM-grade imports",
            description: "Direct from certified Chinese manufacturers",
          },
          {
            title: "Fast island delivery",
            description: "Colombo same-day options available",
          },
          {
            title: "Workshop support",
            description: "Fitment guidance from specialists",
          },
        ],
      },
    },
  });

  await prisma.pageContent.upsert({
    where: { page: "about" },
    update: {
      title: "About SmartMart Motors",
      isPublished: true,
      seoTitle: "About Us | SmartMart Motors Sri Lanka",
      seoDescription:
        "Learn how SmartMart Motors supplies premium Chinese OEM automotive spare parts across Sri Lanka.",
      content: {
        mission:
          "To deliver reliable, affordable OEM-quality spare parts so every Sri Lankan vehicle stays on the road longer.",
        story:
          "SmartMart Motors sources directly from certified Chinese manufacturers producing parts to Japanese and Korean OEM specifications. We specialise in high-turn SKUs for workshops, fleets and private owners.",
        values: [
          "Quality first",
          "Transparent pricing",
          "Rapid fulfilment",
          "Expert advice",
        ],
        contact: {
          phone: "0775475141",
          email: "smartmartmotors@gmail.com",
        },
      },
    },
    create: {
      page: "about",
      title: "About SmartMart Motors",
      isPublished: true,
      seoTitle: "About Us | SmartMart Motors Sri Lanka",
      seoDescription:
        "Learn how SmartMart Motors supplies premium Chinese OEM automotive spare parts across Sri Lanka.",
      content: {
        mission:
          "To deliver reliable, affordable OEM-quality spare parts so every Sri Lankan vehicle stays on the road longer.",
        story:
          "SmartMart Motors sources directly from certified Chinese manufacturers producing parts to Japanese and Korean OEM specifications. We specialise in high-turn SKUs for workshops, fleets and private owners.",
        values: [
          "Quality first",
          "Transparent pricing",
          "Rapid fulfilment",
          "Expert advice",
        ],
        contact: {
          phone: "0775475141",
          email: "smartmartmotors@gmail.com",
        },
      },
    },
  });

  console.log("✓ Page content (home, about)");

  const faqs = [
    {
      question: "Are your parts genuine OEM quality?",
      answer:
        "Yes. We import from certified Chinese manufacturers that produce to Japanese and Korean OEM specifications. Many lines are brand-compatible (Bosch, Denso, KYB, NGK, Aisin, Gates, Bando).",
      category: "products",
      sortOrder: 1,
    },
    {
      question: "Do you deliver island-wide in Sri Lanka?",
      answer:
        "We deliver across Sri Lanka via trusted couriers. Colombo metro orders can often be fulfilled the same or next day.",
      category: "shipping",
      sortOrder: 2,
    },
    {
      question: "How can I confirm fitment for my vehicle?",
      answer:
        "Send your chassis number, model year and part photo via WhatsApp to 0775475141 or use the product inquiry form. Our team verifies compatibility before you pay.",
      category: "products",
      sortOrder: 3,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Bank transfer, cash on delivery (select areas), and card payments where available. Bulk workshop accounts can arrange credit terms on approval.",
      category: "payment",
      sortOrder: 4,
    },
    {
      question: "Do you offer wholesale pricing for garages?",
      answer:
        "Yes. Registered workshops and fleets receive volume pricing. Contact smartmartmotors@gmail.com or WhatsApp us to open a trade account.",
      category: "wholesale",
      sortOrder: 5,
    },
    {
      question: "What is your return / warranty policy?",
      answer:
        "Unused parts in original packaging may be returned within 7 days subject to inspection. Manufacturer warranty periods vary by category (typically 3–12 months).",
      category: "policy",
      sortOrder: 6,
    },
    {
      question: "Can you source rare or discontinued parts?",
      answer:
        "We regularly special-order Chinese OEM equivalents. Share the OEM part number and we will quote lead time and price within one business day.",
      category: "products",
      sortOrder: 7,
    },
    {
      question: "How do I track my order?",
      answer:
        "Once dispatched we share tracking details via SMS or WhatsApp. For urgent updates call 0775475141 during business hours.",
      category: "shipping",
      sortOrder: 8,
    },
  ];

  await prisma.faq.deleteMany({});
  await prisma.faq.createMany({ data: faqs });

  console.log(`✓ ${faqs.length} FAQs`);
  console.log("✅ Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
