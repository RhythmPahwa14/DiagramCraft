export default function SidebarDock({ activeTab = "navigation", onTabChange }) {
  const tabs = [
    { id: "navigation", icon: "insert_chart", title: "Templates & Shapes" },
    { id: "intelligence", icon: "psychology", title: "Diagram Insights" },
    { id: "history", icon: "history", title: "Version History" },
  ];

  return (
    <aside className="w-14 flex flex-col items-center py-4 gap-6 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-background-dark/80">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`p-2 rounded-xl transition-all ${
            activeTab === tab.id
              ? "text-primary bg-primary/10"
              : "text-slate-400 hover:text-primary hover:bg-primary/10"
          }`}
          title={tab.title}
          onClick={() => onTabChange?.(tab.id)}
        >
          <span className="material-symbols-outlined">{tab.icon}</span>
        </button>
      ))}

      <div className="mt-auto flex flex-col gap-4">
        <button
          className="p-2 rounded-xl text-slate-400 hover:text-primary transition-all"
          title="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </aside>
  );
}
