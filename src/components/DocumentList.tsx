import type { DocumentSelectDB } from '#/db/schema';
import { Pencil, Trash2 } from 'lucide-react';

interface DocumentListProps {
  documentList: DocumentSelectDB[];
}

const DocumentList: React.FC<DocumentListProps> = (props) => {
  console.log(props.documentList.length);

  return (
    <ul className="list bg-base-100 rounded-box shadow-md mt-4">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Document List
      </li>

      <li className="list-row items-center">
        <p>Glitter</p>
        <button className="btn btn-square btn-ghost ml-auto">
          <Trash2 />
        </button>
        <button className="btn btn-square btn-ghost ml-2">
          <Pencil />
        </button>
      </li>
    </ul>
  );
};

export default DocumentList;
