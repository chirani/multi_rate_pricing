import { useDeleteDocument } from '#/queries';
import { useRouter } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface DeleteDocumentDialogProps {
  document_id: number;
}

const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = ({
  document_id,
}) => {
  const { navigate } = useRouter();
  const [isOpen, tooggleDialog] = useState(false);
  const { mutateAsync: deleteDocument, isPending } = useDeleteDocument();

  return (
    <>
      <button
        className="btn btn-lg btn-ghost btn-square hover:text-error"
        onMouseDown={() => {
          tooggleDialog(true);
        }}
      >
        <Trash2 />
      </button>

      <dialog id="my_modal_3" className="modal" open={isOpen}>
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
          <h3 className="font-bold text-lg text-error">Document Deletion!</h3>
          <p className="py-4">Are you sure you want to delete this item</p>
          <div className="modal-action">
            <button
              className="btn btn-error"
              onMouseDown={async () => {
                await deleteDocument({ document_id });
                tooggleDialog(false);
                navigate({ to: '/' });
              }}
            >
              {!isPending ? 'Delete' : 'Pending...'}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteDocumentDialog;
