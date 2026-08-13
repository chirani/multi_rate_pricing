import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema for an individual member
const memberSchema = z.object({
  name: z.string().min(1, { message: 'Member name is required' }),
  role: z.enum(['editor', 'viewer', 'admin'], 'Select a valid role'),
});

// Main Document Schema with nested Member array
const newDocumentSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be 100 characters or less' }),
  status: z.enum(['active', 'inactive']),
  members: z
    .array(memberSchema)
    .min(1, { message: 'At least one member is required' }),
});

// Export TypeScript types
export type Member = z.infer<typeof memberSchema>;
export type NewDocumentFormValues = z.infer<typeof newDocumentSchema>;

const NewDocumentForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewDocumentFormValues>({
    resolver: zodResolver(newDocumentSchema),
    defaultValues: {
      title: '',
      status: 'active',
      members: [{ name: '', role: 'viewer' }], // Initial empty member
    },
  });

  // Dynamic array controller for subform
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const onSubmit = (data: NewDocumentFormValues) => {
    console.log('Submitted Document Data:', data);
    reset();
  };

  return (
    <div className="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-200 mx-auto my-6">
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

          <div className="divider">Document Members</div>

          {/* Members Subform */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-base-content/70">
                Line Items({fields.length})
              </span>
              <button
                type="button"
                onClick={() => append({ name: '', role: 'viewer' })}
                className="btn btn-outline btn-sm btn-primary"
              >
                + Add Member
              </button>
            </div>

            {/* Array error message if minimum length fails */}
            {errors.members?.root && (
              <p className="text-error text-xs">
                {errors.members.root.message}
              </p>
            )}

            {/* Member Input Rows */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-1"
              >
                {/* Member Name */}
                <div className="form-control flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Member Name"
                    {...register(`members.${index}.name`)}
                    className={`input input-bordered input-sm w-full ${
                      errors.members?.[index]?.name ? 'input-error' : ''
                    }`}
                  />
                  {errors.members?.[index]?.name && (
                    <span className="text-error text-xs mt-1">
                      {errors.members[index]?.name?.message}
                    </span>
                  )}
                </div>

                {/* Member Role */}
                <div className="form-control w-full sm:w-40">
                  <select
                    {...register(`members.${index}.role`)}
                    className={`select select-bordered select-sm w-full ${
                      errors.members?.[index]?.role ? 'select-error' : ''
                    }`}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.members?.[index]?.role && (
                    <span className="text-error text-xs mt-1">
                      {errors.members[index]?.role?.message}
                    </span>
                  )}
                </div>

                {/* Remove Member Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="btn btn-ghost btn-sm btn-square text-error self-end sm:self-center"
                  title="Remove Member"
                >
                  ✕
                </button>
              </div>
            ))}
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
