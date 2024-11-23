import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

const Editor = ({ value, onChange }) => {
  const [currentChanges, setCurrentChanges] = useState(value);

  const handleChange = (content) => {
    onChange(content);
    setCurrentChanges(content);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Content Editor Section */}
      <div className="w-full md:w-1/2 bg-white p-4 border border-gray-300 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Editor</h3>
        <SunEditor
          setOptions={{
            buttonList: [
              ['undo', 'redo'],
              ['bold', 'italic', 'underline', 'strike'],
              ['list', 'align', 'fontSize', 'formatBlock'],
              ['link', 'image', 'video', 'table'],
              ['fullScreen', 'showBlocks', 'codeView'],
              ['preview', 'print'],
              // ['save', 'template'],
            ],
          }}
          setContents={value}
          onChange={handleChange}
        />
      </div>

      {/* Preview Section */}
      <div className="w-full md:w-1/2 bg-gray-50 p-4 border border-gray-300 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Preview</h3>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: currentChanges }}
        />
      </div>
    </div>
  );
};

export default Editor;
