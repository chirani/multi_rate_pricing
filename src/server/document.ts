import { db } from '#/db';
import { documents as documentsTable, lineItems } from '#/db/schema';
import { createServerFn } from '@tanstack/react-start';
import { eq, and } from 'drizzle-orm';
import z from 'zod';
import { userAuthMiddleware } from './auth';

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
  unit_price_cent: z.int(),
  discount: z.string(),
  tax: z.number(),
});

export const getDocumentsSchema = z.object({
  user_id: z.string(),
});

export const inserDocument = createServerFn({ method: 'GET' })
  .middleware([userAuthMiddleware])
  .validator(z.array(documentSchema))
  .handler(async ({ data }) => {
    return await db.insert(documentsTable).values(data).returning();
  });

export const insertLineItems = createServerFn({ method: 'POST' })
  .middleware([userAuthMiddleware])
  .validator(z.array(lineItemSchema))
  .handler(async ({ data }) => {
    return await db.insert(lineItems).values(data).returning();
  });

export const fetchDocuments = createServerFn({ method: 'GET' })
  .middleware([userAuthMiddleware])
  .validator(getDocumentsSchema)
  .handler(async ({ context }) => {
    const { user } = context;

    return await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.user_id, user.id));
  });

export const fetchDocumentById = createServerFn({ method: 'GET' })
  .middleware([userAuthMiddleware])
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
  .middleware([userAuthMiddleware])
  .validator(
    z.object({
      document_id: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const documentlineItems = await db
      .select()
      .from(lineItems)
      .where(eq(lineItems.document_id, data.document_id));

    return documentlineItems.length ? documentlineItems : [];
  });

export const deleteLineItems = createServerFn({ method: 'POST' })
  .middleware([userAuthMiddleware])
  .validator(
    z.object({
      document_id: z.number(),
    })
  )
  .handler(async ({ data, context }) => {
    const { user } = context;
    const document = await fetchDocumentById({
      data: { document_id: data.document_id },
    });

    if (document.length === 0) {
      return;
    }

    if (document[0].user_id !== user.id) {
      return;
    }

    return await db
      .delete(lineItems)
      .where(and(eq(lineItems.document_id, data.document_id)));
  });

export const updateDocumentById = createServerFn({ method: 'POST' })
  .middleware([userAuthMiddleware])
  .validator(
    z.object({
      document_id: z.number(),
      title: z.string(),
      customer: z.string(),
    })
  )
  .handler(async ({ data, context }) => {
    const { customer, title, document_id } = data;
    const { user } = context;

    return await db
      .update(documentsTable)
      .set({ title, customer })
      .where(
        and(
          eq(documentsTable.user_id, user.id),
          eq(documentsTable.id, document_id),
          eq(documentsTable.status, 'draft')
        )
      );
  });

export const updateLineItems = createServerFn({ method: 'POST' })
  .middleware([userAuthMiddleware])
  .validator(
    z.object({
      document_id: z.number(),
      lineItems: z.array(lineItemSchema),
    })
  )
  .handler(async ({ data }) => {
    const { document_id, lineItems } = data;
    await deleteLineItems({ data: { document_id } });
    return await insertLineItems({ data: lineItems });
  });

export const deleteDocument = createServerFn({ method: 'POST' })
  .middleware([userAuthMiddleware])
  .validator(z.object({ document_id: z.number() }))
  .handler(async ({ data, context }) => {
    const { document_id } = data;
    const { user } = context;

    await deleteLineItems({ data: { document_id } });
    await db
      .delete(documentsTable)
      .where(
        and(
          eq(documentsTable.id, document_id),
          eq(documentsTable.user_id, user.id)
        )
      );
    return document_id;
  });

export const finalizeDocument = createServerFn({ method: 'POST' })
  .middleware([userAuthMiddleware])
  .validator(
    z.object({
      document_id: z.number(),
      status: z.enum(['draft', 'finalized']),
    })
  )
  .handler(async ({ data, context }) => {
    const { user } = context;
    const { document_id } = data;

    await db
      .update(documentsTable)
      .set({ status: 'finalized' })
      .where(
        and(
          eq(documentsTable.user_id, user.id),
          eq(documentsTable.id, document_id),
          eq(documentsTable.status, 'draft')
        )
      );

    return document_id;
  });
