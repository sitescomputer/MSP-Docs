import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Example Admin",
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  const upsType = await prisma.hardwareAssetType.upsert({
    where: { name: "UPS" },
    update: { defaultReplacementIntervalMonths: 36 },
    create: { name: "UPS", defaultReplacementIntervalMonths: 36 }
  });

  const firewallType = await prisma.hardwareAssetType.upsert({
    where: { name: "Firewall" },
    update: { defaultReplacementIntervalMonths: 60 },
    create: { name: "Firewall", defaultReplacementIntervalMonths: 60 }
  });

  const customer = await prisma.customer.upsert({
    where: { id: "demo-nephrology-associates" },
    update: {},
    create: {
      id: "demo-nephrology-associates",
      name: "Nephrology Associates",
      legalName: "Nephrology Associates PLLC",
      category: "Managed",
      primaryContactName: "Amanda Wilson",
      mainEmail: "admin@example-customer.test",
      accountManager: "Example Admin",
      primaryTechnician: "Example Admin"
    }
  });

  const location = await prisma.location.upsert({
    where: { id: "demo-nephrology-main" },
    update: {},
    create: {
      id: "demo-nephrology-main",
      customerId: customer.id,
      name: "Main Office",
      address: "730 Highland Ave",
      timeZone: "America/New_York"
    }
  });

  await prisma.customerUserAccess.upsert({
    where: { userId_customerId: { userId: admin.id, customerId: customer.id } },
    update: {},
    create: { userId: admin.id, customerId: customer.id }
  });

  await prisma.hardwareAsset.createMany({
    data: [
      {
        customerId: customer.id,
        locationId: location.id,
        assetTypeId: upsType.id,
        name: "Main Rack UPS",
        manufacturer: "APC",
        model: "Smart-UPS 1500",
        serialNumber: "DEMO-UPS-001",
        installedDate: new Date("2023-06-12"),
        warrantyExpirationDate: new Date("2026-06-12"),
        replacementIntervalMonths: 36
      },
      {
        customerId: customer.id,
        locationId: location.id,
        assetTypeId: firewallType.id,
        name: "NEPH-FW-01",
        manufacturer: "Fortinet",
        model: "FortiGate 80F",
        serialNumber: "DEMO-FW-001",
        installedDate: new Date("2022-08-01"),
        warrantyExpirationDate: new Date("2027-08-01"),
        replacementIntervalMonths: 60
      }
    ],
    skipDuplicates: true
  });

  const folder = await prisma.folder.create({
    data: {
      customerId: customer.id,
      name: "Procedures",
      path: "Customers / Managed / Nephrology Associates / Procedures"
    }
  });

  await prisma.documentationPage.create({
    data: {
      customerId: customer.id,
      folderId: folder.id,
      title: "After-hours escalation procedure",
      body: "<p>Use the practice administrator as the first escalation contact for outages affecting patient care.</p>",
      createdBy: admin.name,
      updatedBy: admin.name
    }
  });

  for (const requirement of [
    ["contacts", "Contacts"],
    ["locations", "Locations"],
    ["hardware", "Hardware"],
    ["internet", "Internet Services"],
    ["contracts", "Contracts"],
    ["network", "Network Documentation"],
    ["files", "Files"],
    ["docs", "Documentation Pages"]
  ] as const) {
    await prisma.documentationRequirement.upsert({
      where: { key: requirement[0] },
      update: {},
      create: { key: requirement[0], label: requirement[1] }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

