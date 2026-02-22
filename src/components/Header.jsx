export default function Header({ fileName = "Untitled", liveRender, onToggleLiveRender, onProjectsClick }) {
  return (
    <header className="h-14 border-b border-slate-200 dark:border-primary/20 flex items-center justify-between px-4 bg-white dark:bg-background-dark/50 backdrop-blur-md z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-7 bg-primary rounded flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">account_tree</span>
          </div>
          <h1 className="font-bold text-sm tracking-tight hidden md:block">DiagramCraft</h1>
        </div>
        
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <button 
            onClick={onProjectsClick}
            className="hover:text-primary cursor-pointer transition-colors flex items-center gap-1"
          >
            <span>Projects</span>
            <span className="material-symbols-outlined text-xs">expand_more</span>
          </button>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-primary/10 px-2 py-1 rounded">
            {fileName}.mmd
          </span>
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden sm:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">search</span>
          </div>
          <input
            className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-lg py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/50 placeholder:text-slate-400 transition-all"
            placeholder="Search or jump to... (⌘K)"
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLiveRender}
          className={`flex items-center gap-4 px-3 py-1 rounded-full border transition-all cursor-pointer ${
            liveRender
              ? "bg-green-50 dark:bg-green-500/20 border-green-300 dark:border-green-500/30"
              : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
          }`}
          title={liveRender ? "Live rendering enabled" : "Live rendering disabled - click Render button"}
        >
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${
              liveRender ? "bg-green-500 animate-pulse" : "bg-slate-400"
            }`}></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {liveRender ? "Live" : "Manual"}
            </span>
          </div>
          <div className="w-px h-3 bg-slate-300 dark:bg-white/20"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-primary">cloud_done</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Synced</span>
          </div>
        </button>

        <button className="size-8 rounded-full bg-slate-900 dark:bg-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-lg">person</span>
        </button>
      </div>
    </header>
  );
}
