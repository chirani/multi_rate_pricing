import LoginForm from '#/components/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <div className="mx-auto w-96 mt-6">
        <LoginForm />
      </div>
    </main>
  );
}
