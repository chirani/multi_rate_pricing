import DeleteDocumentDialog from '#/components/DeleteDocumentDialog';
import { fetchDocumentByIdQueryOpts, fetchLineItemsQueryOpts } from '#/queries';
import { lineDiscount } from '#/utils/discount';
import { formatValue } from '#/utils/formatters';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';

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

  if (documentList.length != 1) {
    return <></>;
  }

  const document = documentList[0];

  const lineItemAdjusted = lineItemList.map((li) => {
    const discountAmount = lineDiscount(
      li.quantity,
      li.unit_price_cent,
      li.discount
    );

    const subTotal = (li.unit_price_cent * li.quantity) / 100;
    const totalAfterDiscount = subTotal - discountAmount;
    const lineTax = (totalAfterDiscount * li.tax) / 100;
    const lineTotal = totalAfterDiscount + lineTax;

    return {
      id: li.id,
      description: li.description,
      subTotal,
      totalAfterDiscount,
      lineTax,
      lineTotal,
      discountAmount,
    };
  });

  const subTotal = lineItemAdjusted.reduce(
    (acc, curr) => acc + curr.subTotal,
    0
  );

  const totalDiscount = lineItemAdjusted.reduce(
    (acc, curr) => acc + curr.discountAmount,
    0
  );

  const totalTax = lineItemAdjusted.reduce(
    (acc, curr) => acc + curr.lineTax,
    0
  );

  const GrandTotal = lineItemAdjusted.reduce(
    (acc, curr) => acc + curr.lineTotal,
    0
  );

  return (
    <main className="max-w-300 mx-auto">
      <div className="py-5 flex justify-between items-center">
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
          <DeleteDocumentDialog document_id={Number(id)} />
        </div>
      </div>
      <table className="table mt-8">
        <thead>
          <tr>
            <th>Description</th>
            <th>Subtotal</th>
            <th>Discount Ammount</th>
            <th>After Discount</th>
            <th>Tax</th>
            <th>Line Item</th>
          </tr>
        </thead>
        <tbody>
          {lineItemAdjusted.map((li) => {
            return (
              <tr key={li.id}>
                <th>{li.description}</th>
                <th>{formatValue(li.subTotal)}</th>
                <th>{formatValue(li.discountAmount)}</th>
                <th>{formatValue(li.totalAfterDiscount)}</th>
                <th>{formatValue(li.lineTax)}</th>
                <th>{formatValue(li.lineTotal)}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-col items-end p-6 mt-6">
        <p>
          Subtotal <span className="font-bold">{formatValue(subTotal)}</span>
        </p>
        <p>
          Total Discount :{' '}
          <span className="font-bold">{formatValue(totalDiscount)}</span>
        </p>
        <p>
          Total Tax : <span className="font-bold">{formatValue(totalTax)}</span>
        </p>

        <p className="text-xl border-t-1 pt-3">
          Grand Total :{' '}
          <span className="font-bold">{formatValue(GrandTotal)}</span>
        </p>
      </div>
    </main>
  );
}
