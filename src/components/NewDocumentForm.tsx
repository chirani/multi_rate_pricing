import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Delete } from 'lucide-react';
import { useInsertDocuments, useInsertLineItems } from '#/queries';

const lineItemSchema = z.object({
  description: z.string().min(3),
  quantity: z.int().min(1),
  unit_price: z.number(),
  discount: z.number(),
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

const NewDocumentForm: React.FC = () => {
  const {
    register,
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewDocumentFormValues>({
    resolver: zodResolver(newDocumentSchema),
    defaultValues: {
      title: '',
      status: 'draft',
      lineItems: [
        { description: 'new', quantity: 1, unit_price: 1, discount: 0, tax: 0 },
      ],
    },
  });
  useInsertDocuments();
  useInsertLineItems();
  // Dynamic array controller for subform
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const hasDuplicateLineItems = (lineItems: LineItemSchema[]) => {
    const lineItemsTitles = new Set<string>();

    return lineItems.some((lineItem: LineItemSchema) => {
      if (lineItemsTitles.has(lineItem.description)) {
        return true;
      }
      lineItemsTitles.add(lineItem.description);
      return false;
    });
  };

  const onSubmit = (data: NewDocumentFormValues) => {
    console.log('Submitted Document Data:', data);
    const isValid = hasDuplicateLineItems(data.lineItems);
    if (isValid) {
      setError('root', {
        type: 'value',
        message: "You can't have two line items with the same description?",
      });
      return;
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
                    unit_price: 1,
                    discount: 0,
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
                          {...register(`lineItems.${index}.unit_price`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors?.lineItems?.[index]?.unit_price?.message && (
                          <p className="text-error max-w-40-200">
                            {errors?.lineItems?.[index]?.unit_price?.message}
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
                          {...register(`lineItems.${index}.discount`, {
                            valueAsNumber: true,
                          })}
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
                'Create Document'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDocumentForm;
