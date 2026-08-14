import NewDocumentForm from '#/components/NewDocumentForm';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/document/new')({
  beforeLoad: ({ context }) => {
    if (context.userSession === null) {
      throw redirect({ to: '/login' });
    }
    return { user: context.userSession.user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const deps = Route.useRouteContext();

  const user_id = deps.user.id;
  return (
    <main className="mx-auto md:w-300 mt-12">
      <NewDocumentForm user_id={user_id} />
    </main>
  );
}
