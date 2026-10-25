# Next.js E-commerce Starter — Sequelize Edition

Stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- PostgreSQL
- Sequelize ORM
- sequelize-cli migrations
- WhatsApp Cloud API
- Twilio SMS

## Install

```bash
npm install
cp .env.example .env
docker compose up -d
```

## Database migration

```bash
npm run db:migrate
```

## Seed

```bash
npm run db:seed
```

Development admin:

```text
admin@example.com
ChangeMe123!
```

Sample coupon:

```text
WELCOME10
```

## Run

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Sequelize layout

```text
src/database/
├── config.cjs
├── sequelize.ts
├── migrations/
│   └── 20261018000100-create-ecommerce-tables.cjs
├── models/
│   ├── User.ts
│   ├── Address.ts
│   ├── Category.ts
│   ├── Product.ts
│   ├── Coupon.ts
│   ├── Order.ts
│   ├── OrderItem.ts
│   ├── NotificationLog.ts
│   └── index.ts
└── seed.ts
```

## Transactions

Checkout uses:

```ts
const transaction = await sequelize.transaction();
```

and commits only after:

- address creation
- order creation
- order-item creation
- stock decrement
- coupon usage increment

If any database operation fails, the transaction is rolled back.

Notification delivery is intentionally outside the database transaction. A WhatsApp or SMS failure does not cancel an already-confirmed order; instead the failure is stored in `notificationLogs`.

## Production notes

Before production add:

- request validation (Zod/Valibot)
- inventory locking/reservation
- payment webhook verification
- notification retry queue
- S3/Cloudinary product images
- audit logs
- rate limiting
- payment idempotency
- WhatsApp template messages where required

## Storefront UX additions

- Animated, auto-rotating homepage hero slider with manual arrows and indicators.
- Live cart badge in the sticky header. It updates immediately when products are added, removed, or checkout clears the cart.
- Professional cart screen with product image/name, current price, quantity controls, remove action, subtotal, and checkout summary.
- Customer order history shows the saved order-item product name, quantity, unit price, line total, and current product thumbnail instead of internal product IDs.

## Local product image uploads

Admin product creation now uploads images to:

```text
public/uploads/products/
```

The database stores a public path such as:

```text
/uploads/products/1760000000000-a1b2c3d4e5f6.webp
```

Accepted formats are JPG, PNG, WEBP, and GIF up to 5 MB. Demo product and slider images are also stored in `public/products` and `public/slides`.

> Important deployment note: writing files into the application folder at runtime is appropriate for local development or a persistent Node server. Serverless platforms such as many AWS Amplify/Lambda deployments use ephemeral/read-only application filesystems. For production on those platforms, keep the same database `imageUrl` field but replace the upload route with S3 (recommended) or another persistent object store.


## Professional storefront/admin upgrades

- Product details route: `/products/[slug]`
- Product image preview before create/update
- Product edit page: `/admin/products/[id]/edit`
- Safe archive + permanent delete controls
- Permanent delete blocked when order history references a product
- Inventory page: `/admin/inventory`
- Low-stock indicator: 1-5 units
- Out-of-stock indicator: 0 units
- Quick stock quantity controls
- Redesigned admin dashboard with recent orders and inventory health
- Store footer and polished storefront product presentation

Product images uploaded from the admin panel are saved under `public/uploads/products` for this local/persistent-server version. For serverless production hosting, use S3 or another persistent object store.
# creamy-creation
