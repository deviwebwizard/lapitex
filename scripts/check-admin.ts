const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

const adapter = new PrismaLibSql({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, password: true, role: true }
  })
  console.log('=== ALL USERS IN DATABASE ===')
  users.forEach((u: any) => {
    console.log(`  Email: ${u.email} | Password: "${u.password}" | Role: ${u.role}`)
  })

  console.log('\n=== Testing admin login ===')
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@lapitex.com' }
  })
  if (admin) {
    console.log(`Found admin: ${admin.email}`)
    console.log(`Password in DB: "${admin.password}"`)
    console.log(`Password match with "password123": ${admin.password === 'password123'}`)
    console.log(`Role: ${admin.role}`)
  } else {
    console.log('NO ADMIN USER FOUND!')
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
