import type { DocumentSelectDB } from '#/db/schema';
import { Link } from '@tanstack/react-router';
import { Pencil, Trash2 } from 'lucide-react';

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
        <Link to="/" key={document.id} className="list-row items-center">
          <p>{document.title}</p>
          <button className="btn btn-square btn-ghost ml-auto">
            <Trash2 />
          </button>
          <button className="btn btn-square btn-ghost ml-2">
            <Pencil />
          </button>
        </Link>
      ))}
    </ul>
  );
};

export default DocumentList;
