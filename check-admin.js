const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    console.log('Checking admin credentials...')
    
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminUsername || !adminPassword) {
      console.log('❌ Admin credentials not found in environment variables')
      console.log('Please set ADMIN_USERNAME and ADMIN_PASSWORD in your .env.local file')
      return
    }
    
    const admin = await prisma.admin.findFirst({
      where: { username: adminUsername }
    })
    
    if (admin) {
      console.log('✅ Admin found!')
      console.log('Username:', admin.username)
      console.log('Password: [HIDDEN]')
    } else {
      console.log('❌ No admin found. Creating one...')
      
      const newAdmin = await prisma.admin.create({
        data: {
          username: adminUsername,
          password: adminPassword
        }
      })
      
      console.log('✅ Admin created!')
      console.log('Username:', newAdmin.username)
      console.log('Password: [HIDDEN]')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmin() 