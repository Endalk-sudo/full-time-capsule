import React from "react";
import { File as FileIcon } from "lucide-react";

interface FilePropType {
  id: string;
  file_name: string;
}

const File = ({ file_name }: FilePropType) => {
  return (
    <div className="hover:shadow-accent-foreground flex max-w-30 transform cursor-pointer flex-col items-center gap-1.5 rounded-2xl p-3 shadow-sm transition-all hover:-translate-y-1">
      <FileIcon size={33} />
      <p className="text-xs">
        {file_name?.length > 5 ? `${file_name.slice(0, 10)} ...` : file_name}
      </p>
    </div>
  );
};

export default File;
