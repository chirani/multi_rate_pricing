import DocumentList from '#/components/DocumentList';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { PlusCircle } from 'lucide-react';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.userSession === null) {
      throw redirect({ to: '/login' });
    }
  },
  component: Home,
});

function Home() {
  return (
    <main className="p-8 bg-base-200">
      <div className="max-w-300 mx-auto h-screen">
        <Link to="/document/new" className="btn btn-base-100 mt-3">
          <PlusCircle /> Add Documents
        </Link>
        <DocumentList />
      </div>
    </main>
  );
}
