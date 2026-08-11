import SignUpForm from '#/components/SignupForm';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ context }) => {
    if (context.userSession) {
      throw redirect({ to: '/' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <div className="mx-auto w-96 mt-6">
        <SignUpForm />
      </div>
    </main>
  );
}
