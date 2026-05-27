import React, { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useStudioStore } from "./store";
import { StudioNode } from "./StudioNode";
import { Palette } from "./Palette";
import { Inspector } from "./Inspector";
import { Toolbar } from "./Toolbar";
import { ProjectsSidebar } from "./ProjectsSidebar";
import { Project, fetchDiagram, saveDiagram } from "@/lib/supabase";

const nodeTypes = {
  studioNode: StudioNode,
};

function StudioCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    autoLayout,
  } = useStudioStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [draggingTemplateId, setDraggingTemplateId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [newNodeMode, setNewNodeMode] = useState(false);

  // Project state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [sidebarView, setSidebarView] = useState<"projects" | "palette">("projects");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleDragStart = useCallback((templateId: string) => {
    setDraggingTemplateId(templateId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggingTemplateId) return;
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;
      const pos = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      addNode(draggingTemplateId, pos);
      setDraggingTemplateId(null);
    },
    [draggingTemplateId, addNode, screenToFlowPosition]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      selectNode(node.id);
      setInspectorOpen(true);
      setNewNodeMode(false);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleNew = useCallback(() => {
    useStudioStore.setState({ nodes: [], edges: [], selectedNodeId: null, validationErrors: 0 });
    setInspectorOpen(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentProject) {
      const state = useStudioStore.getState();
      const json = JSON.stringify({ nodes: state.nodes, edges: state.edges }, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.json";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const state = useStudioStore.getState();
      await saveDiagram(currentProject.id, state.nodes, state.edges);
      setSaveMsg("Saved");
      setTimeout(() => setSaveMsg(null), 2000);
    } catch {
      setSaveMsg("Save failed");
      setTimeout(() => setSaveMsg(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [currentProject]);

  const handleExport = useCallback(() => {
    const state = useStudioStore.getState();
    const text =
      `Composable Systems Studio — Diagram Export\n\nNodes (${state.nodes.length}):\n` +
      state.nodes
        .map(
          (n) =>
            `  • ${n.data.label} [${n.data.nodeType}] — ${n.data.inputs.length} inputs, ${n.data.outputs.length} outputs`
        )
        .join("\n") +
      `\n\nEdges (${state.edges.length}):\n` +
      state.edges.map((e) => `  • ${e.source} → ${e.target}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleAutoLayout = useCallback(async () => {
    await autoLayout();
    setTimeout(() => fitView({ duration: 400, padding: 0.1 }), 50);
  }, [autoLayout, fitView]);

  const handleNewNode = useCallback(() => {
    setNewNodeMode(true);
    setInspectorOpen(true);
    selectNode(null);
  }, [selectNode]);

  const handleSelectProject = useCallback(async (project: Project) => {
    setCurrentProject(project);
    try {
      const diagram = await fetchDiagram(project.id);
      if (diagram) {
        useStudioStore.setState({
          nodes: diagram.nodes as any,
          edges: diagram.edges as any,
          selectedNodeId: null,
          validationErrors: 0,
        });
      } else {
        useStudioStore.setState({ nodes: [], edges: [], selectedNodeId: null, validationErrors: 0 });
      }
    } catch {
      useStudioStore.setState({ nodes: [], edges: [], selectedNodeId: null, validationErrors: 0 });
    }
    setInspectorOpen(false);
  }, []);

  // Palette content to pass into ProjectsSidebar when in palette view
  const paletteContent = (
    <Palette onDragStart={handleDragStart} onNewNode={handleNewNode} hideBranding />
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0d0f14",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Toolbar
        onNew={handleNew}
        onSave={handleSave}
        onExport={handleExport}
        onAutoLayout={handleAutoLayout}
        projectName={currentProject?.name}
        saving={saving}
        saveMsg={saveMsg}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Projects / Palette sidebar (drill-down) */}
        <ProjectsSidebar
          currentProjectId={currentProject?.id ?? null}
          onSelectProject={handleSelectProject}
          view={sidebarView}
          setView={setSidebarView}
          paletteContent={paletteContent}
        />

        {/* Canvas */}
        <div
          ref={reactFlowWrapper}
          style={{ flex: 1, position: "relative" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* No project selected overlay */}
          {!currentProject && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    opacity="0.5"
                  >
                    <path d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1e2535",
                  }}
                >
                  Select or create a project
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "13px",
                    color: "#1a1f2a",
                  }}
                >
                  Choose a project from the left sidebar
                </div>
              </div>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            deleteKeyCode={["Backspace", "Delete"]}
            style={{ background: "#0d0f14" }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="#1e2330"
            />
            <MiniMap
              style={{
                background: "#13161f",
                border: "1px solid #1f2535",
                borderRadius: "8px",
              }}
              nodeColor={(node) => {
                const n = node as any;
                return n.data?.color || "#3b82f6";
              }}
              maskColor="rgba(13,15,20,0.8)"
            />
            <Controls
              style={{
                background: "#13161f",
                border: "1px solid #1f2535",
                borderRadius: "8px",
              }}
            />

            {/* Empty state (project selected but no nodes) */}
            {currentProject && nodes.length === 0 && (
              <Panel position="top-center">
                <div
                  style={{
                    marginTop: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      opacity="0.7"
                    >
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="18" cy="18" r="3" />
                      <path d="M9 12h6M15 7.5L9 12M15 16.5L9 12" />
                    </svg>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  >
                    Drop nodes to start building
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      color: "#1e2535",
                    }}
                  >
                    Drag from the palette on the left
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Inspector */}
        {inspectorOpen && (
          <Inspector
            isNewNodeMode={newNodeMode}
            onNewNodeSave={() => {
              setNewNodeMode(false);
              setInspectorOpen(false);
            }}
            onClose={() => {
              setInspectorOpen(false);
              setNewNodeMode(false);
              selectNode(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export function Studio() {
  return (
    <ReactFlowProvider>
      <StudioCanvas />
    </ReactFlowProvider>
  );
}
