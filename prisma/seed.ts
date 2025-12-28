/**
 * Database Seed Script
 *
 * This script creates 3 test businesses with sample clients.
 * It's a legitimate seed file that CAN skip businessId filtering
 * because it's in /prisma directory and runs manually.
 *
 * Usage: npx tsx prisma/seed.ts
 */

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean up existing test data
  console.log("🧹 Cleaning up existing test data...");
  await prisma.client.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✅ Cleanup complete");

  // Create test users and businesses with clients
  const businesses = [
    {
      userName: "Marie Dupont",
      userEmail: "marie@example.com",
      userPassword: "TestPassword123!",
      businessName: "Salon Beauté Marie",
      businessCity: "Paris",
      clients: [
        {
          firstName: "Sophie",
          lastName: "Martin",
          email: "sophie.martin@example.com",
          phone: "+33612345678",
          ville: "Paris",
          codePostal: "75001",
        },
        {
          firstName: "Emilie",
          lastName: "Rousseau",
          email: "emilie.r@example.com",
          phone: "+33687654321",
          ville: "Paris",
          codePostal: "75002",
        },
        {
          firstName: "Claire",
          lastName: "Leclerc",
          email: "claire.l@example.com",
          phone: "+33698765432",
          ville: "Paris",
          codePostal: "75003",
        },
      ],
    },
    {
      userName: "Jean Moreau",
      userEmail: "jean@example.com",
      userPassword: "TestPassword456!",
      businessName: "Coiffure Prestige",
      businessCity: "Lyon",
      clients: [
        {
          firstName: "Pierre",
          lastName: "Benoit",
          email: "pierre.b@example.com",
          phone: "+33612111111",
          ville: "Lyon",
          codePostal: "69000",
        },
        {
          firstName: "Marc",
          lastName: "Fournier",
          email: "marc.f@example.com",
          phone: "+33612222222",
          ville: "Lyon",
          codePostal: "69001",
        },
      ],
    },
    {
      userName: "Caroline Lefebvre",
      userEmail: "caroline@example.com",
      userPassword: "TestPassword789!",
      businessName: "Institut Wellness",
      businessCity: "Marseille",
      clients: [
        {
          firstName: "Nathalie",
          lastName: "Girard",
          email: "nathalie.g@example.com",
          phone: "+33613333333",
          ville: "Marseille",
          codePostal: "13000",
        },
        {
          firstName: "Isabelle",
          lastName: "Blanc",
          email: "isabelle.b@example.com",
          phone: "+33614444444",
          ville: "Marseille",
          codePostal: "13001",
        },
        {
          firstName: "Valérie",
          lastName: "Renard",
          email: "valerie.r@example.com",
          phone: "+33615555555",
          ville: "Marseille",
          codePostal: "13002",
        },
      ],
    },
  ];

  for (const businessData of businesses) {
    try {
      // Hash password
      const hashedPassword = await hash(businessData.userPassword, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: businessData.userName,
          email: businessData.userEmail,
          password: hashedPassword,
          emailVerified: new Date(),
        },
      });

      console.log(`✅ Created user: ${businessData.userEmail}`);

      // Create business linked to user
      const business = await prisma.business.create({
        data: {
          name: businessData.businessName,
          userId: user.id,
          ville: businessData.businessCity,
          primaryColor: "#D4B5A0",
          secondaryColor: "#8B7355",
          subscriptionStatus: "TRIAL",
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      });

      console.log(
        `✅ Created business: ${businessData.businessName} (ID: ${business.id})`
      );

      // Create clients for this business
      for (const clientData of businessData.clients) {
        const client = await prisma.client.create({
          data: {
            ...clientData,
            businessId: business.id,
          },
        });

        console.log(
          `  📝 Created client: ${client.firstName} ${client.lastName} (Business: ${business.id})`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error seeding business ${businessData.businessName}:`,
        error
      );
      throw error;
    }
  }

  console.log("\n✅ Database seed completed successfully!");
  console.log("\nTest credentials:");
  console.log("================");
  businesses.forEach((b) => {
    console.log(`Email: ${b.userEmail}`);
    console.log(`Password: ${b.userPassword}`);
    console.log(`Business: ${b.businessName}`);
    console.log("---");
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
