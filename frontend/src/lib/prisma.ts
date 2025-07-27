import { PrismaClient } from "@prisma/client/edge";

const prismaClientSingleton = () => {
  return new PrismaClient() as PrismaClient;
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma =
  global.prisma ??
  (typeof window === 'undefined' ? prismaClientSingleton() : undefined);

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
