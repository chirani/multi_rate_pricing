import {
  deleteLineItems,
  documentSchema,
  fetchDocumentById,
  fetchDocumentLineItems,
  fetchDocuments,
  inserDocument,
  insertLineItem,
  lineItemSchema,
  updateDocumentById,
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
    mutationFn: async (lineItem: LineItem[]) =>
      await insertLineItem({ data: lineItem }),
  });

export const useDeleteLineItems = () =>
  useMutation({
    mutationKey: ['delete-line-items'],
    mutationFn: async (document_id: number) =>
      await deleteLineItems({ data: { document_id } }),
  });

export const useUpdateDocuments = () =>
  useMutation({
    mutationKey: ['update-line-items'],
    mutationFn: async (data: {
      document_id: number;
      title: string;
      customer: string;
    }) => await updateDocumentById({ data }),
  });

export const fetchDocumentsQueryOpts = ({ user_id }: { user_id: string }) =>
  queryOptions({
    queryKey: ['fetch-documents'],
    queryFn: async () => fetchDocuments({ data: { user_id } }),
  });

export const fetchDocumentByIdQueryOpts = ({
  document_id,
}: {
  document_id: number;
}) =>
  queryOptions({
    queryKey: ['fetch-document-by-id ' + document_id],
    queryFn: async () => fetchDocumentById({ data: { document_id } }),
  });

export const fetchLineItemsQueryOpts = ({
  document_id,
}: {
  document_id: number;
}) =>
  queryOptions({
    queryKey: ['fetch-line-items ' + document_id],
    queryFn: async () => fetchDocumentLineItems({ data: { document_id } }),
  });
