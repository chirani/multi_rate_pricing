import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Delete } from 'lucide-react';
import {
  fetchDocumentByIdQueryOpts,
  fetchLineItemsQueryOpts,
  useDeleteLineItems,
  useInsertLineItems,
  useUpdateDocument,
} from '#/queries';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { parseToCents } from '#/utils/formatters';

const lineItemSchema = z.object({
  description: z.string().min(3),
  quantity: z.int().min(1),
  unit_price_cent: z.string(),
  discount: z.string(),
  tax: z.number(),
});

const newDocumentSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be 100 characters or less' }),
  customer: z
    .string()
    .min(1, { message: 'Customer is required' })
    .max(100, { message: 'Customer must be 100 characters or less' }),
  status: z.enum(['draft', 'finalized']),
  lineItems: z
    .array(lineItemSchema)
    .min(1, { message: 'At least one member is required' }),
});

export type LineItemSchema = z.infer<typeof lineItemSchema>;
export type NewDocumentFormValues = z.infer<typeof newDocumentSchema>;

interface EditDocumentProps {
  user_id: string;
  document_id: number;
}

const EditDocumentForm: React.FC<EditDocumentProps> = (props) => {
  const {
    register,
    control,
    setError,
    setValues,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewDocumentFormValues>({
    resolver: zodResolver(newDocumentSchema),
    defaultValues: {
      title: '',
      status: 'draft',
      lineItems: [
        {
          description: 'new',
          quantity: 1,
          unit_price_cent: '1',
          discount: '0',
          tax: 0,
        },
      ],
    },
  });
  const { navigate } = useRouter();
  const { data: documentData, isSuccess: isDocumentDataSucess } = useQuery(
    fetchDocumentByIdQueryOpts({ document_id: props.document_id })
  );
  const { data: lineItemsData, isSuccess: isLineItemsSuccess } = useQuery(
    fetchLineItemsQueryOpts({ document_id: props.document_id })
  );
  const { mutateAsync: updateDocument } = useUpdateDocument();
  const { mutateAsync: insertLineItems } = useInsertLineItems();
  const { mutateAsync: deleteLineItems } = useDeleteLineItems();

  useEffect(() => {
    if (isDocumentDataSucess && documentData.length) {
      setValues({
        customer: documentData[0].customer,
        title: documentData[0].title,
      });
    }
  }, [documentData, isDocumentDataSucess]);

  useEffect(() => {
    if (isLineItemsSuccess && lineItemsData.length) {
      const lineItemsAdjusted = lineItemsData.map((li) => ({
        ...li,
        unit_price_cent: li.unit_price_cent / 100 + '',
      }));

      reset({ lineItems: lineItemsAdjusted });
    }
  }, [lineItemsData, isLineItemsSuccess]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const hasDuplicateLineItems = (lineItems: LineItemSchema[]) => {
    const lineItemsTitles = new Set<string>();

    if (lineItems.length) {
      return false;
    }

    return lineItems.some((lineItem: LineItemSchema) => {
      if (lineItemsTitles.has(lineItem.description)) {
        return true;
      }
      lineItemsTitles.add(lineItem.description);
      return false;
    });
  };

  const onSubmit = async (data: NewDocumentFormValues) => {
    const isValid = hasDuplicateLineItems(data.lineItems);
    if (isValid) {
      setError('root', {
        type: 'value',
        message: "You can't have two line items with the same description?",
      });

      return;
    }

    try {
      await updateDocument({
        document_id: props.document_id,
        title: data.title,
        customer: data.customer,
      });
      await deleteLineItems(Number(props.document_id));

      const preparedLineItems = data.lineItems.map((li) => ({
        ...li,
        document_id: props.document_id,
        unit_price_cent: parseToCents(li.unit_price_cent),
      }));

      await insertLineItems(preparedLineItems);
      navigate({
        to: '/document/$id',
        params: { id: String(props.document_id) },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-full">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-4">New Document</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Document Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Field */}
            <div className="form-control w-full">
              <label htmlFor="title" className="label">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter document title"
                {...register('title')}
                className={`input input-bordered w-full ${
                  errors.title ? 'input-error' : ''
                }`}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.title.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label htmlFor="title" className="label">
                <span className="label-text font-medium">Customer</span>
              </label>
              <input
                id="customer"
                type="text"
                placeholder="Enter document Customer"
                {...register('customer')}
                className={`input input-bordered w-full ${
                  errors.customer ? 'input-error' : ''
                }`}
              />
              {errors.customer && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.customer.message}
                  </span>
                </label>
              )}
            </div>

            {/* Status Field */}
            <div className="form-control w-full">
              <label htmlFor="status" className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <select
                disabled={true}
                id="status"
                {...register('status')}
                className={`select select-disabled select-bordered w-full ${
                  errors.status ? 'select-error' : ''
                }`}
              >
                <option value="draft">Draft</option>
                <option value="finalized">Finalized</option>
              </select>
              {errors.status && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.status.message}
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="divider">Line Items</div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-base-content/70">
                Line Items({fields.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  append({
                    description: 'new_item',
                    quantity: 1,
                    unit_price_cent: '1',
                    discount: '0',
                    tax: 0,
                  })
                }
                className="btn btn-outline btn-sm btn-neutral"
              >
                + Add Member
              </button>
            </div>

            {errors.lineItems?.root && (
              <p className="text-error text-xs">
                {errors.lineItems.root.message}
              </p>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Tax (%)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((_field, index) => (
                  <tr key={index}>
                    <th>
                      <fieldset className="fieldset">
                        <input
                          className="input input-ghost m-0 min-w-0 block"
                          type="text"
                          {...register(`lineItems.${index}.description`)}
                        />
                        {errors?.lineItems?.[index]?.description?.message && (
                          <p className="text-error">
                            {errors?.lineItems?.[index]?.description?.message}
                          </p>
                        )}
                      </fieldset>
                    </th>
                    <th>
                      <fieldset className="fieldset">
                        <input
                          className="input input-ghost m-0 min-w-0 block"
                          type="text"
                          {...register(`lineItems.${index}.unit_price_cent`)}
                        />
                        {errors?.lineItems?.[index]?.unit_price_cent
                          ?.message && (
                          <p className="text-error max-w-40-200">
                            {
                              errors?.lineItems?.[index]?.unit_price_cent
                                ?.message
                            }
                          </p>
                        )}
                      </fieldset>
                    </th>
                    <th>
                      <fieldset className="fieldset">
                        <input
                          className="input input-ghost m-0 min-w-0 block"
                          type="text"
                          {...register(`lineItems.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors?.lineItems?.[index]?.quantity?.message && (
                          <p className="text-error">
                            {errors?.lineItems?.[index]?.quantity?.message}
                          </p>
                        )}
                      </fieldset>
                    </th>
                    <th>
                      <fieldset className="fieldset">
                        <input
                          className="input input-ghost m-0 min-w-0 block"
                          type="text"
                          {...register(`lineItems.${index}.discount`)}
                        />
                        {errors?.lineItems?.[index]?.discount?.message && (
                          <p className="text-error max-w-full">
                            {errors?.lineItems?.[index]?.discount?.message}
                          </p>
                        )}
                      </fieldset>
                    </th>
                    <th>
                      <fieldset className="fieldset">
                        <input
                          className="input input-ghost m-0 min-w-0 block"
                          type="text"
                          {...register(`lineItems.${index}.tax`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors?.lineItems?.[index]?.tax?.message && (
                          <p className="text-error">
                            {errors?.lineItems?.[index]?.tax?.message}
                          </p>
                        )}
                      </fieldset>
                    </th>
                    <th>
                      <Delete
                        className="hover:text-error"
                        onMouseDown={() => {
                          remove(index);
                        }}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
            <span className="text-error">{errors.root?.message}</span>
          </div>

          <div className="card-actions justify-end mt-8 border-t border-base-200 pt-4">
            <button
              type="button"
              onClick={() => reset()}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                'Update Document'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentForm;
