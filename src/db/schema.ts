import { sqliteTable, integer, text, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const todos = sqliteTable('todos', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  title: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
});

export const documents = sqliteTable('documents', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  user_id: integer({ mode: 'number' }),
  title: text().notNull(),
  status: text().notNull(),
});

export const line_item = sqliteTable(
  'line_items',
  {
    id: integer({ mode: 'number' }).primaryKey({
      autoIncrement: true,
    }),
    document_id: integer()
      .notNull()
      .references(() => documents.id),
    quantity: integer().notNull(),
    unit_price: integer().notNull(),
    discount: integer().notNull().default(0),
    tax: integer(),
  },
  (table) => [
    check('unit_price_min_check', sql`${table.unit_price} >= 1`),
    check('tax_min_check', sql`${table.tax} >= 0`),
    check('discount_min_check', sql`${table.tax} >= 0`),
  ]
);
