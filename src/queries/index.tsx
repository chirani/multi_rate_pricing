import {
  deleteDocument,
  deleteLineItems,
  documentSchema,
  fetchDocumentById,
  fetchDocumentLineItems,
  fetchDocuments,
  finalizeDocument,
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
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.resetQueries({ queryKey: ['fetch-document-by-id'] });
    },
  });

export const useUpdateDocument = () =>
  useMutation({
    mutationKey: ['update-document'],
    mutationFn: async (data: {
      document_id: number;
      title: string;
      customer: string;
    }) => await updateDocumentById({ data }),
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.resetQueries({
        queryKey: ['fetch-documents', 'fetch-document-by-id'],
      });
    },
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
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.resetQueries({
        queryKey: ['fetch-documents', 'fetch-document-by-id'],
      });
    },
  });

export const useFinalizedDocument = () => {
  return useMutation({
    mutationKey: ['finalize-document'],
    mutationFn: async (data: {
      document_id: number;
      status: 'finalized' | 'draft';
    }) => {
      const { document_id, status } = data;
      return await finalizeDocument({ data: { document_id, status } });
    },
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.resetQueries({ queryKey: ['fetch-documents'] });
    },
  });
};

export const useDeleteDocument = () => {
  return useMutation({
    mutationKey: ['delete-document'],
    mutationFn: async (data: { document_id: number }) => {
      const { document_id } = data;
      return await deleteDocument({ data: { document_id } });
    },
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.resetQueries({ queryKey: ['fetch-documents'] });
    },
  });
};

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
