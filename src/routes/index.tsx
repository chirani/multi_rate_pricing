import DocumentList from '#/components/DocumentList';
import { fetchDocumentsQueryOpts } from '#/queries';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { PlusCircle } from 'lucide-react';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.userSession === null) {
      throw redirect({ to: '/login' });
    }
    return { user: context.userSession.user };
  },

  loader: async ({ context }) => {
    const user_id = context.userSession?.user.id ?? '';
    context.queryClient.ensureQueryData(fetchDocumentsQueryOpts({ user_id }));
  },

  component: Home,
});

function Home() {
  const deps = Route.useRouteContext();
  console.log(deps.user.id);

  const { data: documents } = useQuery(
    fetchDocumentsQueryOpts({ user_id: deps.user.id })
  );
  const documentList = documents?.length ? documents : [];

  return (
    <main className="p-8 bg-base-200">
      <div className="max-w-300 mx-auto h-screen">
        <Link to="/document/new" className="btn btn-base-100 mt-3">
          <PlusCircle /> Add Documents
        </Link>
        <DocumentList documentList={documentList} />
      </div>
    </main>
  );
}
