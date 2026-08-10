import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '#/lib/auth-client';

// 1. Define the validation schema using Zod
const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

// 2. Infer the TypeScript type directly from the Zod schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  // 3. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 4. Handle submission
  const onSubmit = async (data: LoginFormData) => {
    authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-base-content">
        Login
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {/* Email */}
        <label className="form-control w-full">
          <input
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className={`input input-bordered w-full ${
              errors.email ? 'input-error' : ''
            }`}
          />
          {errors.email && (
            <div className="label pb-0">
              <span className="label-text-alt text-error text-sm">
                {errors.email.message}
              </span>
            </div>
          )}
        </label>

        {/* Password */}
        <label className="form-control w-full">
          <input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={`input input-bordered w-full ${
              errors.password ? 'input-error' : ''
            }`}
          />
          {errors.password && (
            <div className="label pb-0">
              <span className="label-text-alt text-error text-sm">
                {errors.password.message}
              </span>
            </div>
          )}
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Creating account...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </>
  );
}
