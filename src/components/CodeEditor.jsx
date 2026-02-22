import { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";

export default function CodeEditor({ initialValue, onRender, onChange, editorInstanceRef }) {
  const editorRef = useRef(null);

  useEffect(() => {
    // Prevent double init (React StrictMode)
    if (editorInstanceRef.current) return;

    editorInstanceRef.current = CodeMirror(editorRef.current, {
      value: initialValue,
      mode: "text/plain",
      lineNumbers: true,
      theme: "default",
    });

    // Setup change listener for live rendering
    if (onChange) {
      editorInstanceRef.current.on("change", () => {
        const code = editorInstanceRef.current.getValue();
        onChange(code);
      });
    }

    // Auto-render on initial load
    if (onRender) {
      onRender(initialValue);
    }

    // Cleanup
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.toTextArea();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const handleRenderClick = () => {
    if (editorInstanceRef.current && onRender) {
      const code = editorInstanceRef.current.getValue();
      onRender(code);
    }
  };

  return (
    <div className="flex-1 editor-bg flex flex-col min-w-[30%]">
      <div className="h-9 flex items-center px-4 bg-black/40 border-b border-white/5 justify-between">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          Editor — Mermaid.js
        </span>
        <button
          onClick={handleRenderClick}
          className="px-2 py-0.5 text-[10px] bg-primary hover:bg-primary/80 text-white rounded transition-colors font-bold"
        >
          ⚡ RENDER
        </button>
      </div>
      
      <div className="flex-1 overflow-auto" ref={editorRef}></div>
    </div>
  );
}
