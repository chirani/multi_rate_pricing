import { db } from '#/db';
import { documents as documentsTable, lineItems } from '#/db/schema';
import { createServerFn } from '@tanstack/react-start';
import { eq, and } from 'drizzle-orm';
import z from 'zod';

export const documentSchema = z.object({
  customer: z.string(),
  title: z.string(),
  status: z.string(),
  id: z.number().optional(),
  user_id: z.string(),
  createdAt: z.date().nullable().optional(),
});

export const lineItemSchema = z.object({
  description: z.string().min(3),
  document_id: z.int(),
  quantity: z.int().min(1),
  unit_price: z.number(),
  discount: z.string(),
  tax: z.number(),
});

export const getDocumentsSchema = z.object({
  user_id: z.string(),
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

export const fetchDocuments = createServerFn({ method: 'GET' })
  .validator(getDocumentsSchema)
  .handler(async ({ data }) => {
    return await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.user_id, data.user_id));
  });

export const fetchDocumentById = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      document_id: z.number(),
    })
  )
  .handler(async ({ data }) => {
    return await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, data.document_id));
  });

export const fetchDocumentLineItems = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      document_id: z.number(),
    })
  )
  .handler(async ({ data }) => {
    return await db
      .select()
      .from(lineItems)
      .where(eq(lineItems.document_id, data.document_id));
  });

export const deleteLineItems = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      document_id: z.number(),
    })
  )
  .handler(async ({ data }) => {
    return await db
      .delete(lineItems)
      .where(eq(lineItems.document_id, data.document_id));
  });

export const updateDocumentById = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      document_id: z.number(),
      title: z.string(),
      customer: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { customer, title, document_id } = data;

    return await db
      .update(documentsTable)
      .set({ title, customer })
      .where(
        and(
          eq(documentsTable.id, document_id),
          eq(documentsTable.status, 'draft')
        )
      );
  });
