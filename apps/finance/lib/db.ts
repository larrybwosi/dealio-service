import { PrismaClient } from '@/prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';
const prismaClientSingleton = () => {
  // In production, use Accelerate
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
    // return new PrismaClient().$extends(withAccelerate());
  }
  // In development, use regular Prisma Client
  return new PrismaClient({
    datasourceUrl: 'postgres://postgres:postgres@127.0.0.1:5432/main',
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prisma ?? prismaClientSingleton();
const prisma = db;
export default prisma;
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
