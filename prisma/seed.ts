import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  try {
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username: '',
        password: ''
      }
    })
    console.log('✅ Admin user created:', admin.username)

    // Create sample products
    const product1 = await prisma.product.create({
      data: {
        name: 'Premium Coffee Beans',
        description: 'High-quality Arabica coffee beans from Colombia. Rich flavor with notes of chocolate and caramel.',
        price: 24.99,
        images: ['/products/item1.0.JPG'],
        category: 'Coffee',
        productionDays: 10
      }
    })
    console.log('✅ Product 1 created:', product1.name)

    const product2 = await prisma.product.create({
      data: {
        name: 'Organic Tea Collection',
        description: 'A curated collection of organic teas including green, black, and herbal varieties.',
        price: 19.99,
        images: ['/products/item2.0.JPG'],
        category: 'Tea',
        productionDays: 7
      }
    })
    console.log('✅ Product 2 created:', product2.name)

    console.log('🎉 Database seeded successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 