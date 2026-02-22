import { useState } from "react";

const MERMAID_TEMPLATES = {
  flowchart: {
    name: "Flowchart",
    icon: "account_tree",
    description: "Create process flows and decision trees",
    template: `flowchart TB
    A[Start] --> B{Decision?}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E`,
    shapes: [
      { name: "Rectangle", syntax: "A[Text]", desc: "Standard process" },
      { name: "Rounded", syntax: "A(Text)", desc: "Start/End" },
      { name: "Stadium", syntax: "A([Text])", desc: "Subprocess" },
      { name: "Diamond", syntax: "A{Text}", desc: "Decision" },
      { name: "Circle", syntax: "A((Text))", desc: "Connection point" },
      { name: "Hexagon", syntax: "A{{Text}}", desc: "Preparation" },
      { name: "Parallelogram", syntax: "A[/Text/]", desc: "Input/Output" },
      { name: "Trapezoid", syntax: "A[\\Text/]", desc: "Manual operation" },
    ]
  },
  sequence: {
    name: "Sequence Diagram",
    icon: "swap_horiz",
    description: "Show interactions between objects over time",
    template: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B->>A: Hi Alice!
    Note over A,B: A conversation`
  },
  classDiagram: {
    name: "Class Diagram",
    icon: "class",
    description: "Model object-oriented systems",
    template: `classDiagram
    class Animal {
        +String name
        +int age
        +eat()
        +sleep()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog`
  },
  stateDiagram: {
    name: "State Diagram",
    icon: "radio_button_checked",
    description: "Show state transitions",
    template: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Done
    Processing --> Error: Failed
    Success --> [*]
    Error --> Idle: Retry`
  },
  erDiagram: {
    name: "ER Diagram",
    icon: "storage",
    description: "Database entity relationships",
    template: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date orderDate
    }`
  },
  gantt: {
    name: "Gantt Chart",
    icon: "view_timeline",
    description: "Project timeline and tasks",
    template: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Design           :a1, 2024-01-01, 30d
    Development      :a2, after a1, 20d
    section Phase 2
    Testing          :a3, after a2, 10d
    Deployment       :a4, after a3, 5d`
  },
  pie: {
    name: "Pie Chart",
    icon: "pie_chart",
    description: "Show proportional data",
    template: `pie title Project Budget
    "Development" : 45
    "Design" : 25
    "Marketing" : 20
    "Operations" : 10`
  },
  gitGraph: {
    name: "Git Graph",
    icon: "account_tree",
    description: "Visualize Git branches",
    template: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`
  }
};

const ARROWS_GUIDE = [
  { syntax: "A --> B", desc: "Solid arrow" },
  { syntax: "A -.-> B", desc: "Dotted arrow" },
  { syntax: "A ==> B", desc: "Thick arrow" },
  { syntax: "A -->|text| B", desc: "Arrow with label" },
  { syntax: "A ---|text| B", desc: "Open link with label" },
];

export default function TemplatesPanel({ onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState("flowchart");
  const template = MERMAID_TEMPLATES[selectedCategory];

  return (
    <aside className="w-80 bg-slate-50 dark:bg-background-dark/30 border-l border-slate-200 dark:border-white/5 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          Diagram Templates
        </h3>
        <p className="text-xs text-slate-500">
          Click a template to insert it into the editor
        </p>
      </div>

      {/* Template Categories */}
      <div className="grid grid-cols-2 gap-2 p-3 border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-background-dark/50">
        {Object.entries(MERMAID_TEMPLATES).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
              selectedCategory === key
                ? "bg-primary text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-sm">{value.icon}</span>
            <span className="text-xs font-medium">{value.name}</span>
          </button>
        ))}
      </div>

      {/* Template Details */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            {template.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            {template.description}
          </p>
          <button
            onClick={() => onSelectTemplate(template.template)}
            className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Insert Template
          </button>
        </div>

        {/* Code Preview */}
        <div className="mb-4">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Code Preview
          </h5>
          <pre className="bg-slate-900 text-slate-300 p-3 rounded-lg text-xs font-mono overflow-x-auto">
            {template.template}
          </pre>
        </div>

        {/* Shapes Guide (for flowchart) */}
        {template.shapes && (
          <div className="mb-4">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Available Shapes
            </h5>
            <div className="space-y-2">
              {template.shapes.map((shape, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {shape.name}
                    </span>
                    <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-primary font-mono">
                      {shape.syntax}
                    </code>
                  </div>
                  <p className="text-xs text-slate-500">{shape.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Arrows Guide (for flowchart) */}
        {selectedCategory === "flowchart" && (
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Connection Types
            </h5>
            <div className="space-y-2">
              {ARROWS_GUIDE.map((arrow, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-primary font-mono">
                      {arrow.syntax}
                    </code>
                    <span className="text-xs text-slate-500">{arrow.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
