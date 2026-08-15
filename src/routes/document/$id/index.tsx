// Hello

import { fetchDocumentByIdQueryOpts, fetchLineItemsQueryOpts } from '#/queries';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Pencil, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/document/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const { data: documents } = useQuery(
    fetchDocumentByIdQueryOpts({ document_id: Number(id) })
  );

  const { data: lineItems } = useQuery(
    fetchLineItemsQueryOpts({ document_id: Number(id) })
  );

  const documentList = documents?.length ? documents : [];
  const lineItemList = lineItems?.length ? lineItems : [];

  const lineItemListAdjusted = lineItemList.map((li) => ({
    ...li,
    tax: li.tax ? li.tax : 0,
  }));

  if (documentList.length != 1) {
    return <></>;
  }

  const document = documentList[0];

  const total = lineItemListAdjusted.reduce(
    (acc, curr) => acc + curr.quantity * curr.unit_price,
    0
  );

  const totalDiscount = lineItemListAdjusted.reduce((acc, curr) => {
    const subtotal = curr.quantity * curr.unit_price;
    const discountAmount = (subtotal * curr.discount) / 100;

    return acc + discountAmount;
  }, 0);

  const totalTax = lineItemListAdjusted.reduce((acc, curr) => {
    const subtotal = curr.quantity * curr.unit_price;
    const discountAmount = (subtotal * curr.discount) / 100;
    const taxableAmount = subtotal - discountAmount;

    return acc + (taxableAmount * curr.tax) / 100;
  }, 0);

  return (
    <main className="max-w-300 mx-auto">
      <div className="p-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">{document.title}</h1>
          <p>
            Customer <span className="font-bold">{document.customer}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/document/$id/edit"
            params={{ id }}
            className="btn btn-lg btn-ghost btn-square"
          >
            <Pencil />
          </Link>
          <button className="btn btn-lg btn-ghost btn-square hover:text-error">
            <Trash2 />
          </button>
        </div>
      </div>
      <table className="table mt-8">
        <thead>
          <tr>
            <th>Description</th>
            <th>UnitPrice</th>
            <th>Quantity</th>
            <th>Discount (%)</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {lineItemList.map((li) => (
            <tr key={li.id}>
              <th>{li.description}</th>
              <th>{li.unit_price}</th>
              <th>{li.quantity}</th>
              <th>{li.discount}</th>
              <th>{li.unit_price * li.quantity}</th>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-end p-6 mt-6">
        <p>
          Total Brute : <span className="font-bold">{total}</span>
        </p>
        <p>
          Total Discount : <span className="font-bold">{totalDiscount}</span>
        </p>
        <p>
          Total Tax : <span className="font-bold">{totalTax}</span>
        </p>

        <p className="text-xl border-t-1 pt-3">
          Total To Pay Tax :{' '}
          <span className="font-bold">{total - totalDiscount + totalTax}</span>
        </p>
      </div>
    </main>
  );
}
