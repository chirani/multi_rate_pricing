import type { DocumentSelectDB } from '#/db/schema';
import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';

interface DocumentListProps {
  documentList: DocumentSelectDB[];
}

const DocumentList: React.FC<DocumentListProps> = (props) => {
  const { documentList } = props;
  const isDocumentListEmpty = !documentList.length;

  return (
    <ul className="list bg-base-100 rounded-box shadow-md mt-4">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Document List
      </li>

      {isDocumentListEmpty && (
        <li className="list-row items-center text-lg">
          You don't have any documents
        </li>
      )}

      {documentList.map((document) => (
        <li key={document.id} className="list-row items-center">
          <Link
            className="btn btn-link w-full"
            to="/document/$id"
            params={{ id: String(document.id) }}
          >
            {document.title}
          </Link>
          <div className="btn btn-ghost text-blue-500 mr-auto">
            {document.status}
          </div>
          <Link
            to="/document/$id/edit"
            params={{ id: String(document.id) }}
            className="btn btn-ghost btn-square"
          >
            <Pencil />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DocumentList;
