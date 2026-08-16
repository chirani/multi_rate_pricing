import {
  deleteLineItems,
  documentSchema,
  fetchDocumentById,
  fetchDocumentLineItems,
  fetchDocuments,
  inserDocument,
  insertLineItems,
  lineItemSchema,
  updateDocumentById,
  updateLineItems,
} from '#/server/document';
import { queryOptions, useMutation } from '@tanstack/react-query';
import type z from 'zod';

type Document = z.infer<typeof documentSchema>;
type LineItem = z.infer<typeof lineItemSchema>;

export const useInsertDocuments = () =>
  useMutation({
    mutationKey: ['insert-document'],
    mutationFn: async (documents: Document[]) =>
      await inserDocument({ data: documents }),
  });

export const useInsertLineItems = () =>
  useMutation({
    mutationKey: ['insert-line-items'],
    mutationFn: async (lineItems: LineItem[]) =>
      await insertLineItems({ data: lineItems }),
  });

export const useDeleteLineItems = () =>
  useMutation({
    mutationKey: ['delete-line-items'],
    mutationFn: async (document_id: number) =>
      await deleteLineItems({ data: { document_id } }),
  });

export const useUpdateDocument = () =>
  useMutation({
    mutationKey: ['update-document'],
    mutationFn: async (data: {
      document_id: number;
      title: string;
      customer: string;
    }) => await updateDocumentById({ data }),
  });

export const useUpdateLineItems = () =>
  useMutation({
    mutationKey: ['update-document'],
    mutationFn: async (data: {
      lineItems: LineItem[];
      document_id: number;
    }) => {
      const { lineItems, document_id } = data;
      return await updateLineItems({ data: { lineItems, document_id } });
    },
  });

export const fetchDocumentsQueryOpts = ({ user_id }: { user_id: string }) =>
  queryOptions({
    queryKey: ['fetch-documents'],
    queryFn: async () => await fetchDocuments({ data: { user_id } }),
  });

export const fetchDocumentByIdQueryOpts = ({
  document_id,
}: {
  document_id: number;
}) =>
  queryOptions({
    queryKey: ['fetch-document-by-id ' + document_id],
    queryFn: async () => await fetchDocumentById({ data: { document_id } }),
  });

export const fetchLineItemsQueryOpts = ({
  document_id,
}: {
  document_id: number;
}) =>
  queryOptions({
    queryKey: ['fetch-line-items ' + document_id],
    queryFn: async () =>
      await fetchDocumentLineItems({ data: { document_id } }),
  });
