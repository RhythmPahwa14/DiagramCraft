export default function PreviewCanvas({ diagramRef, onZoomIn, onZoomOut, onRefresh }) {
  return (
    <div className="flex-1 bg-white flex flex-col relative border-l border-slate-200">
      <div className="h-9 flex items-center px-4 bg-slate-50 border-b border-slate-200 justify-between">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          Live Canvas
        </span>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-slate-200 rounded text-slate-600"
            onClick={onZoomIn}
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-sm">zoom_in</span>
          </button>
          <button
            className="p-1 hover:bg-slate-200 rounded text-slate-600"
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-sm">zoom_out</span>
          </button>
          <button
            className="p-1 hover:bg-slate-200 rounded text-slate-600"
            onClick={onRefresh}
            title="Refresh"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>

      <div className="flex-1 dot-grid relative flex items-center justify-center p-12 overflow-auto">
        <div ref={diagramRef} className="diagram-container"></div>
      </div>
    </div>
  );
}
