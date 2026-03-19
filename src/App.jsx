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
  const [diagramTheme, setDiagramTheme] = useState(() => {
    return localStorage.getItem('diagramcraft-theme') || 'default';
  });
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('diagramcraft-custom-colors');
    return saved ? JSON.parse(saved) : {
      primaryColor: '#F8BBD0',
      primaryTextColor: '#1A1A1A',
      secondaryColor: '#C5E1A5',
      secondaryTextColor: '#1A1A1A',
      tertiaryColor: '#FFCCBC',
      tertiaryTextColor: '#1A1A1A',
      primaryBorderColor: '#F06292',
      lineColor: '#757575',
      background: '#FAFAFA',
      mainBkg: '#FFF0F5',
      secondBkg: '#F0F4C3',
      nodeBorder: '#E91E63',
      clusterBkg: '#FCE4EC',
      clusterBorder: '#F48FB1',
      textColor: '#1A1A1A',
      labelColor: '#1A1A1A',
      labelTextColor: '#1A1A1A',
      edgeLabelBackground: 'rgba(0,0,0,0)',
      edgeLabelColor: '#1A1A1A',
      fontSize: '16px',
      fontFamily: 'Arial',
      git0: '#E1BEE7',
      git1: '#B2DFDB',
      git2: '#FFE0B2',
      git3: '#FFCCBC',
      git4: '#C5E1A5',
      git5: '#F8BBD0',
      git6: '#BBDEFB',
      git7: '#E6EE9C',
    };
  });

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
      // Add loading state
      if (diagramRef.current) {
        diagramRef.current.classList.add('loading');
        diagramRef.current.classList.remove('animating');
      }

      // Reinitialize mermaid with current theme
      mermaid.initialize({
        startOnLoad: false,
        theme: diagramTheme === 'custom' ? 'base' : diagramTheme,
        themeVariables: diagramTheme === 'custom' ? {
          ...customColors,
          edgeLabelBackground: 'transparent',
        } : {
          edgeLabelBackground: 'transparent',
          labelTextColor: '#000000',
          labelColor: '#000000',
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
          padding: 12,
        },
      });

      const { svg } = await mermaid.render("diagram_" + Date.now(), code);
      diagramRef.current.innerHTML = svg;

      // Remove loading and trigger animation after a small delay
      requestAnimationFrame(() => {
        if (diagramRef.current) {
          diagramRef.current.classList.remove('loading');
          diagramRef.current.classList.add('animating');
          
          // Remove animating class after animation completes
          setTimeout(() => {
            if (diagramRef.current) {
              diagramRef.current.classList.remove('animating');
            }
          }, 400);
        }
      });

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
      if (diagramRef.current) {
        diagramRef.current.classList.remove('loading', 'animating');
      }
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

  const handleThemeChange = (theme) => {
    setDiagramTheme(theme);
    localStorage.setItem('diagramcraft-theme', theme);
    // Re-render diagram with new theme
    if (editorInstance.current) {
      const code = editorInstance.current.getValue();
      renderDiagram(code);
    }
  };

  const handleColorChange = (colorKey, value) => {
    const updated = { ...customColors, [colorKey]: value };
    setCustomColors(updated);
    localStorage.setItem('diagramcraft-custom-colors', JSON.stringify(updated));
  };

  const handleBulkColorChange = (newColors) => {
    const updated = { ...customColors, ...newColors };
    setCustomColors(updated);
    localStorage.setItem('diagramcraft-custom-colors', JSON.stringify(updated));
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
      downloadPNG({ pixelRatio: 2, fileName: "diagram.png" });
    } else if (format === "png-hd") {
      downloadPNG({ pixelRatio: 4, fileName: "diagram-hd.png" });
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

  const downloadPNG = async ({ pixelRatio = 2, fileName = "diagram.png" } = {}) => {
    const container = diagramRef.current;
    const svg = container?.querySelector("svg");

    if (!container || !svg) {
      alert("Render diagram first");
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(container, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = fileName;
      a.click();
    } catch (error) {
      console.error("PNG export failed:", error);
      alert("Failed to export PNG. Please try again.");
    }
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

  // Re-render diagram when theme or custom colors change
  useEffect(() => {
    if (editorInstance.current) {
      const code = editorInstance.current.getValue();
      if (code && code.trim()) {
        renderDiagram(code);
      }
    }
  }, [diagramTheme, customColors]);

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
            theme={diagramTheme}
            onThemeChange={handleThemeChange}
            customColors={customColors}
            onColorChange={handleColorChange}
            onBulkColorChange={handleBulkColorChange}
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
