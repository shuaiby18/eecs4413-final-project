import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.brand.deleteMany({})

  const hashedPassword = await bcrypt.hash("owner123", 10);

  const owner = await prisma.user.create({
    data: {
      email: 'owner@gmail.com',
      password: hashedPassword
    },
  })

  const category = await prisma.category.createManyAndReturn({
    data: [
      { name: 'Large' },
      { name: 'Small' },
    ],
  })

  const brand = await prisma.brand.createManyAndReturn({
    data: [
      { name: 'Nike' },
      { name: 'Adidas' },
    ]
  })

  await prisma.product.createMany({
    data: [
      {
        name: faker.commerce.productName(),
        image: "https://avatars.githubusercontent.com/kafka",
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: category[0].id,
        brandId: brand[0].id,
        model: "Shirt"
      },
      {
        name: faker.commerce.productName(),
        image: "https://avatars.githubusercontent.com/kafka",
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: category[1].id,
        brandId: brand[1].id,
        model: "Sweater"
      },
      {
        name: faker.commerce.productName(),
        image: "https://avatars.githubusercontent.com/kafka",
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: category[0].id,
        brandId: brand[0].id,
        model: "Pants"
      },
      {
        name: faker.commerce.productName(),
        image: "https://avatars.githubusercontent.com/kafka",
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        categoryId: category[1].id,
        brandId: brand[1].id,
        model: "Hoodie"
      }
    ]
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