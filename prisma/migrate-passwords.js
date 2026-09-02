const { randomBytes, scryptSync } = require('crypto')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function hashPassword(password) {
  const salt = randomBytes(16)
  const derivedKey = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 })
  return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`
}

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, password: true } })
  let migrated = 0
  for (const user of users) {
    if (!user.password.startsWith('scrypt$')) {
      await prisma.user.update({ where: { id: user.id }, data: { password: hashPassword(user.password) } })
      migrated += 1
    }
  }
  console.log(`Migrated ${migrated} plaintext password(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
}).finally(() => prisma.$disconnect())
