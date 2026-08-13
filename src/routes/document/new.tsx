import NewDocumentForm from '#/components/NewDocumentForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/document/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto md:w-300 mt-12">
      <NewDocumentForm />
    </main>
  );
}
