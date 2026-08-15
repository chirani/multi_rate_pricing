import EditDocumentForm from '#/components/EditDocumentForm';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/document/$id/edit')({
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
  const { id } = Route.useParams();

  return (
    <main className="max-w-300 mx-auto">
      <EditDocumentForm document_id={Number(id)} user_id={deps.user.id} />
    </main>
  );
}
