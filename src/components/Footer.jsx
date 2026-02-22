export default function Footer({ onUndo, onRedo, onExport, canUndo = false, canRedo = false }) {
  return (
    <footer className="h-20 bg-slate-100 dark:bg-background-dark border-t border-slate-200 dark:border-white/5 flex items-center px-6 gap-8 z-40">
      {/* Temporal History Label */}
      <div className="flex flex-col min-w-max">
        <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
          Temporal History
        </span>
        <span className="text-xs font-mono text-slate-900 dark:text-slate-100">
          State: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Timeline Slider */}
      <div className="flex-1 flex items-center gap-4 group">
        <span className="text-[10px] text-slate-400 font-mono">-2h</span>
        <div className="relative flex-1 h-8 flex items-center">
          <div className="absolute w-full h-px bg-slate-300 dark:bg-white/10"></div>
          
          {/* Snap Points */}
          <div className="absolute left-0 size-1.5 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
          <div className="absolute left-1/4 size-1.5 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
          <div className="absolute left-1/2 size-2 bg-primary rounded-full shadow-[0_0_8px_rgba(236,91,19,0.5)]"></div>
          <div className="absolute left-3/4 size-1.5 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
          <div className="absolute right-0 size-1.5 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
          
          {/* Active Handle */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-6 bg-primary rounded cursor-grab active:cursor-grabbing border-2 border-white dark:border-background-dark shadow-lg"></div>
        </div>
        <span className="text-[10px] text-primary font-mono font-bold">Now</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            canUndo
              ? "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
              : "text-slate-300 dark:text-slate-700 cursor-not-allowed"
          }`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <span className="material-symbols-outlined text-sm">undo</span>
        </button>
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            canRedo
              ? "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
              : "text-slate-300 dark:text-slate-700 cursor-not-allowed"
          }`}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <span className="material-symbols-outlined text-sm">redo</span>
        </button>
        
        <div className="w-px h-6 bg-slate-300 dark:bg-white/10 mx-2"></div>
        
        <button
          className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
          onClick={onExport}
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Export
        </button>
      </div>
    </footer>
  );
}
