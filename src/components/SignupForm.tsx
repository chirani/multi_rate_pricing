import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '#/lib/auth-client';
import { useRouter } from '@tanstack/react-router';

// 1. Define the validation schema using Zod
const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

// 2. Infer the TypeScript type directly from the Zod schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  // 3. Initialize React Hook Form
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // 4. Handle submission
  const onSubmit = async (data: SignUpFormData) => {
    try {
      await authClient.signUp.email({
        email: data.email,
        name: data.username,
        password: data.password,
      });
    } catch (error) {
      console.log(error);
      setError('root', { message: 'hello Worl' });
    }
    reset();
    await refetch();
    router.invalidate();
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-base-content">
        Create an Account
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {/* Username */}
        <label className="form-control w-full">
          <input
            type="text"
            placeholder="johndoe"
            {...register('username')}
            className={`input input-bordered w-full ${
              errors.username ? 'input-error' : ''
            }`}
          />
          {errors.username && (
            <div className="label pb-0">
              <span className="label-text-alt text-error text-sm">
                {errors.username.message}
              </span>
            </div>
          )}
        </label>

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
            'Sign Up'
          )}
        </button>
      </form>
    </>
  );
}
