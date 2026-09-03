require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { randomBytes, scryptSync } = require('crypto')

const email = (process.env.ADMIN_EMAIL || 'admin@lapitex.com').trim().toLowerCase()
// ADMIN_PASSWORD is preferred for an explicit reset; fall back to the
// existing Railway variable so changing that variable can be applied directly.
const password = process.env.ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD

if (!password) {
  throw new Error('Set ADMIN_PASSWORD or ADMIN_INITIAL_PASSWORD before running this command.')
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function hashPassword(value) {
  const salt = randomBytes(16)
  const derivedKey = scryptSync(value, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024,
  })
  return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`
}

async function main() {
  const admin = await prisma.user.findUnique({ where: { email } })
  if (!admin) throw new Error(`Admin account not found: ${email}`)

  await prisma.user.update({
    where: { id: admin.id },
    data: { password: hashPassword(password), role: 'ADMIN' },
  })
  console.log(`Admin password updated for ${email}.`)
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
