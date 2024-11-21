import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

const Editor = ({ value, onChange }) => {
  const handleChange = (content) => {
    onChange(content);
  };

  return (
    <SunEditor
      setOptions={{
        buttonList: [
          ['undo', 'redo'],
          ['bold', 'italic', 'underline', 'strike'],
          ['list', 'align', 'fontSize', 'formatBlock'],
          ['link', 'image', 'video', 'table'],
          ['fullScreen', 'codeView', 'preview'],
        ],
      }}
      setContents={value}
      onChange={handleChange}
    />
  );
};

export default Editor;
