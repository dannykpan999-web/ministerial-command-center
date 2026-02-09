import { useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as CKEditorBrowser from 'ckeditor5/dist/browser/ckeditor5.js';
import 'ckeditor5/dist/browser/ckeditor5.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escriba el contenido del documento...',
  disabled = false,
  minHeight = '300px',
}: RichTextEditorProps) {
  const {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Paragraph,
    Undo,
    Heading,
    List,
    Alignment,
    Underline,
    Link
  } = CKEditorBrowser;

  const editorRef = useRef<any>(null);

  // Update editor content when value changes externally (e.g., from OCR)
  useEffect(() => {
    if (editorRef.current && editorRef.current.getData() !== value) {
      editorRef.current.setData(value || '');
    }
  }, [value]);

  return (
    <div className="border rounded-md" style={{ minHeight }}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: 'GPL',
          toolbar: {
            items: [
              'undo', 'redo', '|',
              'heading', '|',
              'bold', 'italic', 'underline', '|',
              'link', '|',
              'bulletedList', 'numberedList', '|',
              'alignment'
            ]
          },
          plugins: [
            Bold,
            Essentials,
            Italic,
            Paragraph,
            Undo,
            Heading,
            List,
            Alignment,
            Underline,
            Link
          ],
          placeholder,
          language: 'es',
        }}
        data={value}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        disabled={disabled}
      />
    </div>
  );
}
