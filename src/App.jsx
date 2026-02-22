import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import * as htmlToImage from "html-to-image";

// Import new components
import Header from "./components/Header";
import SidebarDock from "./components/SidebarDock";
import CodeEditor from "./components/CodeEditor";
import PreviewCanvas from "./components/PreviewCanvas";
import IntelligencePanel from "./components/IntelligencePanel";
import Footer from "./components/Footer";
import ProjectsDropdown from "./components/ProjectsDropdown";
import HistoryPanel from "./components/HistoryPanel";
import TemplatesPanel from "./components/TemplatesPanel";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

const initialDiagram = `flowchart TB
A[Sensing Layer] --> B[Edge Layer]
B --> C[Communication Layer]
C --> D[Cloud Layer]
D --> E[Application Layer]
E --> B`;

// Load projects from localStorage
const loadProjects = () => {
  const saved = localStorage.getItem("diagramcraft-projects");
  if (saved) {
    return JSON.parse(saved);
  }
  // Create default project if none exist
  const defaultProject = {
    id: Date.now(),
    name: "My First Diagram",
    code: initialDiagram,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return [defaultProject];
};

// Save projects to localStorage
const saveProjects = (projects) => {
  localStorage.setItem("diagramcraft-projects", JSON.stringify(projects));
};

export default function App() {
  const diagramRef = useRef(null);
  const editorInstance = useRef(null);
  const [activeTab, setActiveTab] = useState("navigation");
  const [projects, setProjects] = useState(loadProjects);
  const [currentProject, setCurrentProject] = useState(() => loadProjects()[0]);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [diagramStats, setDiagramStats] = useState({
    type: "Flowchart",
    complexity: "Medium",
    nodeCount: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [liveRender, setLiveRender] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save projects whenever they change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Update current project code when editor changes
  const updateProjectCode = (code) => {
    if (currentProject) {
      const updatedProjects = projects.map((p) =>
        p.id === currentProject.id
          ? { ...p, code, updatedAt: new Date().toISOString() }
          : p
      );
      setProjects(updatedProjects);
      const updated = updatedProjects.find((p) => p.id === currentProject.id);
      setCurrentProject(updated);
    }
  };

  // Add to history
  const addToHistory = (code) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      code,
      timestamp: Date.now(),
    });
    // Keep only last 50 versions
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const renderDiagram = async (code) => {
    try {
      const { svg } = await mermaid.render("diagram_" + Date.now(), code);
      diagramRef.current.innerHTML = svg;

      // Apply zoom
      const svgElement = diagramRef.current.querySelector("svg");
      if (svgElement) {
        svgElement.style.transform = `scale(${zoom})`;
        svgElement.style.transformOrigin = "center center";
      }

      // Update stats (basic parsing)
      const lines = code.split("\n").filter((l) => l.trim());
      setDiagramStats({
        type: getDiagramType(code),
        complexity: lines.length > 10 ? "High" : lines.length > 5 ? "Medium" : "Low",
        nodeCount: lines.filter((l) => l.includes("[") || l.includes("(")).length,
      });
    } catch (err) {
      diagramRef.current.innerHTML = `
        <pre style="color:red; white-space:pre-wrap; font-family: monospace; padding: 1rem;">
${err.message}
        </pre>`;
      setDiagramStats({ type: "Error", complexity: "N/A", nodeCount: 0 });
    }
  };

  const getDiagramType = (code) => {
    if (code.includes("flowchart") || code.includes("graph")) return "Flowchart";
    if (code.includes("sequenceDiagram")) return "Sequence";
    if (code.includes("classDiagram")) return "Class";
    if (code.includes("stateDiagram")) return "State";
    if (code.includes("erDiagram")) return "ER Diagram";
    if (code.includes("gantt")) return "Gantt";
    if (code.includes("pie")) return "Pie";
    if (code.includes("gitGraph")) return "Git";
    return "Unknown";
  };

  const handleRestoreVersion = (index) => {
    const version = history[index];
    if (version && editorInstance.current) {
      editorInstance.current.setValue(version.code);
      updateProjectCode(version.code);
      renderDiagram(version.code);
      setHistoryIndex(index);
    }
  };

  const handleSelectTemplate = (template) => {
    if (editorInstance.current) {
      editorInstance.current.setValue(template);
      updateProjectCode(template);
      renderDiagram(template);
      addToHistory(template);
    }
  };

  const handleRefresh = () => {
    if (editorInstance.current) {
      const code = editorInstance.current.getValue();
      renderDiagram(code);
    }
  };

  const handleCodeChange = (code) => {
    updateProjectCode(code);
    addToHistory(code);
    if (liveRender) {
      renderDiagram(code);
    }
  };

  // Project management functions
  const handleCreateProject = (name) => {
    const newProject = {
      id: Date.now(),
      name,
      code: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setCurrentProject(newProject);
    
    // Clear editor and set new empty content
    if (editorInstance.current) {
      editorInstance.current.setValue("");
    }
    if (diagramRef.current) {
      diagramRef.current.innerHTML = "";
    }
    // Reset history for new project
    setHistory([{ code: "", timestamp: Date.now() }]);
    setHistoryIndex(0);
  };

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    if (editorInstance.current) {
      editorInstance.current.setValue(project.code);
    }
    renderDiagram(project.code);
    // Reset history for new project
    setHistory([{ code: project.code, timestamp: Date.now() }]);
    setHistoryIndex(0);
  };

  const handleEditProject = (id, newName) => {
    const updatedProjects = projects.map((p) =>
      p.id === id ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
    );
    setProjects(updatedProjects);
    if (currentProject?.id === id) {
      setCurrentProject(updatedProjects.find((p) => p.id === id));
    }
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    
    // If deleting current project, switch to first available or create new
    if (currentProject?.id === id) {
      if (updatedProjects.length > 0) {
        setCurrentProject(updatedProjects[0]);
        if (editorInstance.current) {
          editorInstance.current.setValue(updatedProjects[0].code);
        }
        renderDiagram(updatedProjects[0].code);
      } else {
        // No projects left, create a new one
        const newProject = {
          id: Date.now(),
          name: "New Diagram",
          code: initialDiagram,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProjects([newProject]);
        setCurrentProject(newProject);
        if (editorInstance.current) {
          editorInstance.current.setValue(newProject.code);
        }
        renderDiagram(newProject.code);
        return;
      }
    }
    
    setProjects(updatedProjects);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      handleRestoreVersion(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      handleRestoreVersion(historyIndex + 1);
    }
  };

  const handleExport = (format) => {
    if (format === "svg") {
      downloadSVG();
    } else if (format === "png") {
      downloadPNG();
    }
  };

  const downloadSVG = () => {
    const svg = diagramRef.current.querySelector("svg");
    if (!svg) return alert("Render diagram first");

    const blob = new Blob([svg.outerHTML], {
      type: "image/svg+xml",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "diagram.svg";
    a.click();
  };

  const downloadPNG = () => {
    htmlToImage.toPng(diagramRef.current).then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "diagram.png";
      a.click();
    });
  };

  // Apply zoom when it changes
  useEffect(() => {
    const svgElement = diagramRef.current?.querySelector("svg");
    if (svgElement) {
      svgElement.style.transform = `scale(${zoom})`;
      svgElement.style.transformOrigin = "center center";
      svgElement.style.transition = "transform 0.2s ease";
    }
  }, [zoom]);

  // Initialize history with current project code
  useEffect(() => {
    if (currentProject && history.length === 0) {
      addToHistory(currentProject.code);
    }
  }, [currentProject?.id]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history.length]);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden h-screen flex flex-col">
      <Header 
        fileName={currentProject?.name || "Untitled"} 
        liveRender={liveRender} 
        onToggleLiveRender={() => setLiveRender(!liveRender)}
        onProjectsClick={() => setIsProjectsOpen(!isProjectsOpen)}
      />

      <ProjectsDropdown
        projects={projects}
        currentProject={currentProject}
        onCreateProject={handleCreateProject}
        onSelectProject={handleSelectProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
      />

      <main className="flex-1 flex overflow-hidden">
        <SidebarDock activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="flex-1 flex overflow-hidden">
          <CodeEditor
            initialValue={currentProject?.code || ""}
            onRender={renderDiagram}
            onChange={handleCodeChange}
            editorInstanceRef={editorInstance}
          />

          <PreviewCanvas
            diagramRef={diagramRef}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRefresh={handleRefresh}
          />

          {activeTab === "intelligence" && (
            <IntelligencePanel diagramStats={diagramStats} structure={[]} />
          )}
          {activeTab === "history" && (
            <HistoryPanel
              history={history}
              currentIndex={historyIndex}
              onRestoreVersion={handleRestoreVersion}
            />
          )}
          {activeTab === "navigation" && (
            <TemplatesPanel onSelectTemplate={handleSelectTemplate} />
          )}
        </section>
      </main>

      <Footer 
        onUndo={handleUndo} 
        onRedo={handleRedo} 
        onExport={handleExport}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
    </div>
  );
}
