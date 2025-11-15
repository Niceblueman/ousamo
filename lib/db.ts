import { PrismaClient } from "@prisma/client"
import path from "path"
import fs from "fs"

const dbDir = path.join(process.cwd(), "data")

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Prisma Client singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Maintain backward compatibility
export function getDatabase() {
  return prisma
}

export async function closeDatabase() {
  await prisma.$disconnect()
}

