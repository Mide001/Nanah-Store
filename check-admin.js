const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    console.log('Checking admin credentials...')
    
    const admin = await prisma.admin.findFirst()
    
    if (admin) {
      console.log('✅ Admin found!')
      console.log('Username:', admin.username)
      console.log('Password:', admin.password)
    } else {
      console.log('❌ No admin found. Creating one...')
      
      const newAdmin = await prisma.admin.create({
        data: {
          username: 'admin',
          password: 'admin123'
        }
      })
      
      console.log('✅ Admin created!')
      console.log('Username:', newAdmin.username)
      console.log('Password:', newAdmin.password)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmin() 