import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Delete } from 'lucide-react';

// Define schema for an individual member

const lineItemSchema = z.object({
  description: z.string().min(3),
  quantity: z.int().min(1),
  unit_price: z.number(),
  discount: z.number(),
  tax: z.number(),
});
// Main Document Schema with nested Member array
const newDocumentSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be 100 characters or less' }),
  status: z.enum(['active', 'inactive']),
  lineItems: z
    .array(lineItemSchema)
    .min(1, { message: 'At least one member is required' }),
});

// Export TypeScript types
export type lineItemSchema = z.infer<typeof lineItemSchema>;
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
      status: 'active',
      lineItems: [
        { description: 'new', quantity: 1, unit_price: 1, discount: 0, tax: 0 },
      ], // Initial empty member
    },
  });

  // Dynamic array controller for subform
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const onSubmit = (data: NewDocumentFormValues) => {
    console.log('Submitted Document Data:', data);
    // reset();
    setError('root', {
      type: 'value',
      message: "You can't have two line items with the same description?",
    });
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

            {/* Status Field */}
            <div className="form-control w-full">
              <label htmlFor="status" className="label">
                <span className="label-text font-medium">Status</span>
              </label>
              <select
                id="status"
                {...register('status')}
                className={`select select-bordered w-full ${
                  errors.status ? 'select-error' : ''
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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

          {/* Members Subform */}
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
                className="btn btn-outline btn-sm btn-primary"
              >
                + Add Member
              </button>
            </div>

            {/* Array error message if minimum length fails */}
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
                {fields.map((field, index) => (
                  <tr key={index}>
                    <th>
                      <input
                        className="input input-ghost m-0 min-w-0 block"
                        type="text"
                        {...register(`lineItems.${index}.description`)}
                      />
                    </th>
                    <th>
                      <input
                        className="input input-ghost m-0 min-w-0 block"
                        type="text"
                        {...register(`lineItems.${index}.unit_price`)}
                      />
                    </th>
                    <th>
                      <input
                        className="input input-ghost m-0 min-w-0 block"
                        type="text"
                        {...register(`lineItems.${index}.quantity`)}
                      />
                    </th>
                    <th>
                      <input
                        className="input input-ghost m-0 min-w-0 block"
                        type="text"
                        {...register(`lineItems.${index}.discount`)}
                      />
                    </th>
                    <th>
                      <input
                        className="input input-ghost m-0 min-w-0 block"
                        type="text"
                        {...register(`lineItems.${index}.tax`)}
                      />
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

          {/* Form Actions */}
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
