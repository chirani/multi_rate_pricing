import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/document/update')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/document/update"!</div>
}
