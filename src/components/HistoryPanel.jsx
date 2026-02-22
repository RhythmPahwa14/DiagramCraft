export default function HistoryPanel({ history, currentIndex, onRestoreVersion }) {
  if (history.length === 0) {
    return (
      <aside className="w-64 bg-slate-50 dark:bg-background-dark/30 border-l border-slate-200 dark:border-white/5 flex flex-col p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Version History
        </h3>
        <p className="text-xs text-slate-400 italic">No history yet. Start editing to create history.</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-slate-50 dark:bg-background-dark/30 border-l border-slate-200 dark:border-white/5 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Version History
        </h3>
        <p className="text-xs text-slate-500">
          {history.length} {history.length === 1 ? 'version' : 'versions'} saved
        </p>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => onRestoreVersion(index)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                index === currentIndex
                  ? "bg-primary/10 border-primary/30 shadow-sm"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Version {history.length - index}
                </span>
                {index === currentIndex && (
                  <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-mono">
                {item.code.substring(0, 50)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-white/5">
        <div className="text-xs text-slate-500 text-center">
          Click a version to restore
        </div>
      </div>
    </aside>
  );
}
