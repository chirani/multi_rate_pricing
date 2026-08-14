import { db } from '#/db';
import { documents as documentsTable, lineItems } from '#/db/schema';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

export const documentSchema = z.object({
  customer: z.string(),
  title: z.string(),
  status: z.string(),
  id: z.number().optional(),
  user_id: z.number().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export const lineItemSchema = z.object({
  description: z.string().min(3),
  document_id: z.int(),
  quantity: z.int().min(1),
  unit_price: z.number(),
  discount: z.number(),
  tax: z.number(),
});

export const inserDocument = createServerFn({ method: 'GET' })
  .validator(z.array(documentSchema))
  .handler(async ({ data }) => {
    return await db.insert(documentsTable).values(data).returning();
  });

export const insertLineItem = createServerFn({ method: 'POST' })
  .validator(z.array(lineItemSchema))
  .handler(async ({ data }) => {
    return await db.insert(lineItems).values(data).returning();
  });
