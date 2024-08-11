import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.user.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.brand.deleteMany({})

  // Create an owner user
  const hashedPassword = await bcrypt.hash("owner123", 10);
  const owner = await prisma.user.create({
    data: {
      email: 'owner@gmail.com',
      password: hashedPassword
    },
  })

  // Create categories
  const categories = await prisma.category.createManyAndReturn({
    data: [
      { name: 'Large' },
      { name: 'Small' },
    ],
  })

  // Create brands
  const brands = await prisma.brand.createManyAndReturn({
    data: [
      { name: 'Nike' },
      { name: 'Adidas' },
    ]
  })

  // Create 20 products
  const productsData = Array.from({ length: 20 }).map(() => ({
    name: faker.commerce.productName(),
    image: faker.image.imageUrl(64, 64, 'product', true),  // Dynamic product images
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    categoryId: faker.helpers.arrayElement(categories).id,
    brandId: faker.helpers.arrayElement(brands).id,
    model: faker.helpers.arrayElement(['Shirt', 'Sweater', 'Pants', 'Hoodie']),
  }));

  await prisma.product.createMany({
    data: productsData,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
