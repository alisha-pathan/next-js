// lib/prisma.ts
// Creates the shared Prisma client connected to PostgreSQL.
// Import this wherever the app needs to read or write the database.

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;
