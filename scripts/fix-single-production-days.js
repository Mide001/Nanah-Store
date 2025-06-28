const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    if (typeof product.productionDays !== "number") {
      await prisma.product.update({
        where: { id: product.id },
        data: { productionDays: 7 },
      });
      console.log(`Patched product ${product.id} with productionDays: 7`);
    }
  }
  await prisma.$disconnect();
}

main();
