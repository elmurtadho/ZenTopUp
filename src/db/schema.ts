import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// Games table
export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  publisher: text('publisher').notNull(),
  category: text('category').notNull(),
  iconUrl: text('icon_url').notNull(),
  bannerUrl: text('banner_url').notNull(),
  tagline: text('tagline'),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false).notNull(),
  rating: real('rating').default(4.8),
  minPrice: integer('min_price').default(1000).notNull(),
  serverRequired: integer('server_required', { mode: 'boolean' }).default(false).notNull(),
  serverList: text('server_list'), // JSON string array
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Items table
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gameId: integer('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  nominal: integer('nominal').notNull(),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  currency: text('currency').default('IDR').notNull(),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Promos table
export const promos = sqliteTable('promos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  discountType: text('discount_type').notNull(), // 'percent' | 'fixed'
  amount: integer('amount').notNull(),
  minPurchase: integer('min_purchase').default(0).notNull(),
  maxDiscount: integer('max_discount'),
  imageUrl: text('image_url').notNull(),
  gameSlug: text('game_slug'),
  startsAt: text('starts_at').notNull(),
  endsAt: text('ends_at').notNull(),
  terms: text('terms'), // JSON string array
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique(),
  phone: text('phone').unique(),
  passwordHash: text('password_hash'),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  memberLevel: text('member_level').default('Bronze').notNull(), // 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum'
  role: text('role').default('user').notNull(), // 'user' | 'admin'
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), // e.g. ZEN-123456
  userId: integer('user_id').references(() => users.id),
  gameId: integer('game_id')
    .notNull()
    .references(() => games.id),
  itemId: integer('item_id')
    .notNull()
    .references(() => items.id),
  gameUserId: text('game_user_id').notNull(),
  serverId: text('server_id'),
  whatsapp: text('whatsapp').notNull(),
  email: text('email'),
  itemPrice: integer('item_price').notNull(),
  discountAmount: integer('discount_amount').default(0).notNull(),
  adminFee: integer('admin_fee').default(0).notNull(),
  totalAmount: integer('total_amount').notNull(),
  promoCode: text('promo_code'),
  paymentMethod: text('payment_method').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'diproses' | 'berhasil' | 'gagal'
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Payment Methods table
export const paymentMethods = sqliteTable('payment_methods', {
  id: text('id').primaryKey(), // 'qris', 'gopay', 'bca-va', etc.
  name: text('name').notNull(),
  category: text('category').notNull(), // 'QRIS' | 'E-Wallet' | 'Virtual Account' | 'Convenience Store'
  iconUrl: text('icon_url').notNull(),
  adminFee: integer('admin_fee').default(0).notNull(),
  minAmount: integer('min_amount').default(1000).notNull(),
  maxAmount: integer('max_amount').default(50000000).notNull(),
  instructions: text('instructions'), // JSON string array
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Payments table
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  method: text('method').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'berhasil' | 'gagal'
  amount: integer('amount').notNull(),
  externalRef: text('external_ref'),
  paidAt: text('paid_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Notifications table
export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  orderId: text('order_id').references(() => orders.id),
  type: text('type').notNull(), // 'order_created' | 'order_success' | 'order_failed' | 'promo' | 'system'
  title: text('title').notNull(),
  message: text('message').notNull(),
  linkHref: text('link_href'),
  linkText: text('link_text'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Notification Settings table
export const notificationSettings = sqliteTable('notification_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  whatsappTxStatus: integer('whatsapp_tx_status', { mode: 'boolean' }).default(true).notNull(),
  whatsappPromo: integer('whatsapp_promo', { mode: 'boolean' }).default(false).notNull(),
  emailReceipt: integer('email_receipt', { mode: 'boolean' }).default(true).notNull(),
  emailNewsletter: integer('email_newsletter', { mode: 'boolean' }).default(false).notNull(),
  inappOrderUpdate: integer('inapp_order_update', { mode: 'boolean' }).default(true).notNull(),
  inappMaintenance: integer('inapp_maintenance', { mode: 'boolean' }).default(true).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const gamesRelations = relations(games, ({ many }) => ({
  items: many(items),
  orders: many(orders),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  game: one(games, {
    fields: [items.gameId],
    references: [games.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  game: one(games, {
    fields: [orders.gameId],
    references: [games.id],
  }),
  item: one(items, {
    fields: [orders.itemId],
    references: [items.id],
  }),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  payments: many(payments),
  notifications: many(notifications),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  notifications: many(notifications),
}));
