const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { randomBytes, scryptSync } = require('crypto')

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })

function hashPassword(password) {
  const salt = randomBytes(16)
  const derivedKey = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 })
  return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`
}

async function main() {
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD
  const customerPassword = process.env.CUSTOMER_INITIAL_PASSWORD
  if (!adminPassword || !customerPassword) {
    throw new Error('ADMIN_INITIAL_PASSWORD and CUSTOMER_INITIAL_PASSWORD must be set before seeding')
  }

  // Clear existing products
  await prisma.product.deleteMany({});
  
  // Seed Users
  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@lapitex.com' } })
  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lapitex.com',
        password: hashPassword(adminPassword),
        role: 'ADMIN'
      }
    })
  }

  const customerExists = await prisma.user.findUnique({ where: { email: 'customer@test.com' } })
  if (!customerExists) {
    await prisma.user.create({
      data: {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: hashPassword(customerPassword),
        role: 'CUSTOMER'
      }
    })
  }

  // Seed Products
  const products = [
    {
      name: 'Refurbished MacBook Pro M1 2020',
      description: 'Excellent condition MacBook Pro with M1 chip, 8GB RAM, 256GB SSD. Battery health 95%.',
      price: 65000,
      originalPrice: 122900,
      category: 'Laptops',
      condition: 'Refurbished',
      stock: 5,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Dell Latitude 5400 - Core i5 8th Gen',
      description: 'Business class laptop. Core i5 8265U, 16GB RAM, 512GB NVMe. Minor scratches on body.',
      price: 18500,
      originalPrice: 45000,
      category: 'Laptops',
      condition: 'Used',
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'HP EliteDesk 800 G4 Mini',
      description: 'Compact desktop. Intel Core i7 8700T, 16GB RAM, 512GB SSD. Includes power adapter.',
      price: 22000,
      originalPrice: 60000,
      category: 'Desktops',
      condition: 'Refurbished',
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Lenovo ThinkPad T490s',
      description: 'Ultra-slim business laptop. Core i7 8th Gen, 16GB RAM, 512GB SSD. Perfect for office use.',
      price: 28000,
      originalPrice: 85000,
      category: 'Laptops',
      condition: 'Refurbished',
      stock: 4,
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'HP Pavilion Gaming 15',
      description: 'Budget gaming laptop. Ryzen 5 4600H, GTX 1650 4GB, 8GB RAM, 512GB NVMe.',
      price: 35000,
      originalPrice: 65000,
      category: 'Laptops',
      condition: 'Refurbished',
      stock: 3,
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Custom Built Gaming PC - RTX 3060',
      description: 'Ryzen 5 5600X, 16GB RGB RAM, 1TB NVMe, RTX 3060 12GB. Built with brand new components.',
      price: 68000,
      originalPrice: 85000,
      category: 'Desktops',
      condition: 'New',
      stock: 2,
      imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Crucial 16GB DDR4 3200MHz Laptop RAM',
      description: 'Brand new sealed laptop memory module. Compatible with Dell, HP, Lenovo.',
      price: 2800,
      originalPrice: 4500,
      category: 'Parts',
      condition: 'New',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Samsung 970 EVO Plus 1TB NVMe M.2',
      description: 'High performance NVMe SSD. Pulled from working system, 99% health.',
      price: 5500,
      originalPrice: 8500,
      category: 'Parts',
      condition: 'Used',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1597849005986-8f3bb6ce1381?auto=format&fit=crop&q=80&w=800',
      isFeatured: false,
    },
    {
      name: 'Original Dell 65W Type-C Charger',
      description: 'Genuine Dell USB-C Power Adapter. Compatible with Latitude and XPS series.',
      price: 1800,
      originalPrice: 3500,
      category: 'Parts',
      condition: 'Refurbished',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Replacement Laptop Battery for HP Pavilion',
      description: 'High-quality replacement 3-cell battery for HP Pavilion 14/15 series.',
      price: 2200,
      originalPrice: 4000,
      category: 'Parts',
      condition: 'New',
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1624434207284-727de9e22312?auto=format&fit=crop&q=80&w=800',
      isFeatured: false,
    },
    {
      name: '15.6" IPS Laptop Replacement Screen',
      description: 'FHD 1080p IPS display panel with 30-pin eDP connector.',
      price: 4500,
      originalPrice: 8000,
      category: 'Parts',
      condition: 'New',
      stock: 5,
      imageUrl: 'https://images.unsplash.com/photo-1590740924045-8f641a949437?auto=format&fit=crop&q=80&w=800',
      isFeatured: false,
    },
    {
      name: 'Backlit Keyboard for Lenovo ThinkPad',
      description: 'Original US-English backlit keyboard replacement for T480/T490.',
      price: 2500,
      originalPrice: 4500,
      category: 'Parts',
      condition: 'Used',
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
      isFeatured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
