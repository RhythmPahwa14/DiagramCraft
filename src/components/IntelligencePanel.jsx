export default function IntelligencePanel({ diagramStats = {}, structure = [] }) {
  const {
    type = "Flowchart",
    complexity = "Medium",
    nodeCount = 0
  } = diagramStats;

  return (
    <aside className="w-64 bg-slate-50 dark:bg-background-dark/30 border-l border-slate-200 dark:border-white/5 flex flex-col">
      {/* Diagram Insights */}
      <div className="p-4 border-b border-slate-200 dark:border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Diagram Insights
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Type</span>
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 rounded">
              {type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Complexity</span>
            <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
              {complexity}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Nodes</span>
            <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
              {nodeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Structure Outline */}
      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Structure Outline
        </h3>
        {structure.length > 0 ? (
          <div className="space-y-1">
            {structure.map((node, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-200 dark:hover:bg-white/5 rounded cursor-pointer transition-colors group"
              >
                <span className="material-symbols-outlined text-sm text-slate-400">
                  {node.icon || "subdirectory_arrow_right"}
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {node.label}
                </span>
                {node.id && (
                  <span className="ml-auto text-[10px] text-primary opacity-0 group-hover:opacity-100">
                    ID: {node.id}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No structure detected yet</p>
        )}
      </div>

      {/* AI Suggestions */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5">
        <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          Suggest Improvements
        </button>
      </div>
    </aside>
  );
}
