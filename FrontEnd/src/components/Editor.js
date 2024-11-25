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
        <SunEditor
          setOptions={{
            height: 800,
            buttonList: [
              ['undo', 'redo'],
              ['bold', 'italic', 'underline', 'strike'],
              ['fontColor', 'hiliteColor', 'textStyle'],
              ['list', 'align', 'fontSize', 'formatBlock','horizontalRule', 'lineHeight'],
              ['removeFormat'],
              ['link', 'image', 'video', 'table'],
              ['fullScreen', 'showBlocks', 'codeView'],
              ['preview', 'print'],
              // ['save', 'template'],
            ],
            sanitize: false,
            allowScripts: true,
          }}
          setContents={value}
          onChange={handleChange}
        />
  );
};

export default Editor;
