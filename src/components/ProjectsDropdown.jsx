import { useState } from "react";

export default function ProjectsDropdown({ 
  projects, 
  currentProject, 
  onCreateProject, 
  onSelectProject, 
  onEditProject, 
  onDeleteProject, 
  isOpen, 
  onClose 
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateProject(newName.trim());
      setNewName("");
      setIsCreating(false);
      onClose();
    }
  };

  const handleEdit = (id) => {
    if (newName.trim()) {
      onEditProject(id, newName.trim());
      setNewName("");
      setIsEditing(false);
      setEditingId(null);
    }
  };

  const startEdit = (project) => {
    setIsEditing(true);
    setEditingId(project.id);
    setNewName(project.name);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      ></div>

      {/* Dropdown Menu */}
      <div className="absolute top-12 left-4 z-50 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Projects</h3>
        </div>

        {/* Create New Project Section */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-700">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span className="font-medium">Create New Project</span>
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewName("");
                  }
                }}
                placeholder="Enter project name..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="flex-1 px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:opacity-90 font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewName("");
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Projects List */}
        <div className="max-h-96 overflow-auto">
          {projects.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No projects yet. Create your first project!
            </div>
          ) : (
            <div className="py-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`group px-3 py-2 mx-2 mb-1 rounded-lg transition-colors ${
                    currentProject?.id === project.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {isEditing && editingId === project.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEdit(project.id);
                          if (e.key === "Escape") {
                            setIsEditing(false);
                            setEditingId(null);
                            setNewName("");
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project.id)}
                          className="flex-1 px-2 py-1 text-xs bg-primary text-white rounded hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            setNewName("");
                          }}
                          className="flex-1 px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          onSelectProject(project);
                          onClose();
                        }}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-primary">
                            description
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {project.name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 ml-6 mt-0.5">
                          Modified {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </button>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(project)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                          title="Edit project name"
                        >
                          <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-400">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${project.name}"?`)) {
                              onDeleteProject(project.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          title="Delete project"
                        >
                          <span className="material-symbols-outlined text-sm text-red-600 dark:text-red-400">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
