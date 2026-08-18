import { useFinalizedDocument } from '#/queries';
import { useRouter } from '@tanstack/react-router';
import React, { useState } from 'react';

interface FinalizeDocumentDialogProps {
  document_id: number;
  status: 'draft' | 'finalized';
}

const FinalizeDocumentDialog: React.FC<FinalizeDocumentDialogProps> = ({
  document_id,
  status,
}) => {
  const { navigate } = useRouter();
  const [isOpen, tooggleDialog] = useState(false);
  const { mutateAsync: finalizeDocument, isPending } = useFinalizedDocument();

  return (
    <>
      <button
        disabled={status === 'finalized'}
        className="btn btn btn-info btn-outline disabled:btn-disabled"
        onMouseDown={() => {
          tooggleDialog(true);
        }}
      >
        {status === 'finalized' ? 'Finalized' : 'Finalize Document'}
      </button>
      <dialog id="finalize_dialog" className="modal" open={isOpen}>
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onMouseDown={() => {
                tooggleDialog(false);
              }}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-info">
            Document Finalization!
          </h3>
          <p className="pt-4">Are you sure you want to finalize this item</p>
          <p className="pb-4">
            You won't be able to{' '}
            <span className="text-warning underline">edit </span>
            this Document post Finalization
          </p>
          <div className="modal-action">
            <button
              className="btn btn-info"
              onMouseDown={async () => {
                tooggleDialog(false);
                await finalizeDocument({ document_id, status });
                navigate({ to: '/' });
              }}
            >
              {!isPending ? 'Finalize' : 'Pending...'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default FinalizeDocumentDialog;
