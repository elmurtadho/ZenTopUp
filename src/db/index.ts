import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Determine database URL:
// - Remote Turso: libsql://<db-name>-<org>.turso.io
// - Local SQLite: file:zentopup.db
const localDbPath = path.resolve('zentopup.db').replace(/\\/g, '/');
const url = process.env.TURSO_DATABASE_URL || `file:${localDbPath}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });

let dbInitialized = false;

// Auto initialize tables if not exist
export async function initDatabase() {
  if (dbInitialized) return;
  try {
    await client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        publisher TEXT NOT NULL,
        category TEXT NOT NULL,
        icon_url TEXT NOT NULL,
        banner_url TEXT NOT NULL,
        tagline TEXT,
        is_popular INTEGER NOT NULL DEFAULT 0,
        rating REAL DEFAULT 4.8,
        min_price INTEGER NOT NULL DEFAULT 1000,
        server_required INTEGER NOT NULL DEFAULT 0,
        server_list TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        nominal INTEGER NOT NULL,
        price INTEGER NOT NULL,
        original_price INTEGER,
        currency TEXT NOT NULL DEFAULT 'IDR',
        is_popular INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS promos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        discount_type TEXT NOT NULL,
        amount INTEGER NOT NULL,
        min_purchase INTEGER NOT NULL DEFAULT 0,
        max_discount INTEGER,
        image_url TEXT NOT NULL,
        game_slug TEXT,
        starts_at TEXT NOT NULL,
        ends_at TEXT NOT NULL,
        terms TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        name TEXT NOT NULL,
        avatar_url TEXT,
        member_level TEXT NOT NULL DEFAULT 'Bronze',
        role TEXT NOT NULL DEFAULT 'user',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        game_id INTEGER NOT NULL REFERENCES games(id),
        item_id INTEGER NOT NULL REFERENCES items(id),
        game_user_id TEXT NOT NULL,
        server_id TEXT,
        whatsapp TEXT NOT NULL,
        email TEXT,
        item_price INTEGER NOT NULL,
        discount_amount INTEGER NOT NULL DEFAULT 0,
        admin_fee INTEGER NOT NULL DEFAULT 0,
        total_amount INTEGER NOT NULL,
        promo_code TEXT,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payment_methods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        icon_url TEXT NOT NULL,
        admin_fee INTEGER NOT NULL DEFAULT 0,
        min_amount INTEGER NOT NULL DEFAULT 1000,
        max_amount INTEGER NOT NULL DEFAULT 50000000,
        instructions TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        amount INTEGER NOT NULL,
        external_ref TEXT,
        paid_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        order_id TEXT REFERENCES orders(id),
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        link_href TEXT,
        link_text TEXT,
        is_read INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notification_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        whatsapp_tx_status INTEGER NOT NULL DEFAULT 1,
        whatsapp_promo INTEGER NOT NULL DEFAULT 0,
        email_receipt INTEGER NOT NULL DEFAULT 1,
        email_newsletter INTEGER NOT NULL DEFAULT 0,
        inapp_order_update INTEGER NOT NULL DEFAULT 1,
        inapp_maintenance INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT,
        image_url TEXT NOT NULL,
        target_url TEXT,
        badge_text TEXT,
        position INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS web_popups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        tag TEXT,
        description TEXT NOT NULL,
        image_url TEXT,
        button_text TEXT,
        button_url TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Safe migration: add cost_price column to items if not exists
    try {
      await client.execute('ALTER TABLE items ADD COLUMN cost_price INTEGER DEFAULT 0;');
    } catch {
      // Column already exists, ignore
    }
    dbInitialized = true;
  } catch (err) {
    console.warn('[DB] Warning during table init:', err);
  }
}
