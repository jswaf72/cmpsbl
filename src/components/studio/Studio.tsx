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
    selectedNodeId,
    autoLayout,
  } = useStudioStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [draggingTemplateId, setDraggingTemplateId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [newNodeMode, setNewNodeMode] = useState(false);

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

  const handleSave = useCallback(() => {
    const state = useStudioStore.getState();
    const json = JSON.stringify({ nodes: state.nodes, edges: state.edges }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExport = useCallback(() => {
    // Export as SVG-like summary
    const state = useStudioStore.getState();
    const text = `Composable Systems Studio — Diagram Export\n\nNodes (${state.nodes.length}):\n` +
      state.nodes.map((n) => `  • ${n.data.label} [${n.data.nodeType}] — ${n.data.inputs.length} inputs, ${n.data.outputs.length} outputs`).join("\n") +
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
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Palette */}
        <Palette onDragStart={handleDragStart} onNewNode={handleNewNode} />

        {/* Canvas */}
        <div
          ref={reactFlowWrapper}
          style={{ flex: 1, position: "relative" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
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

            {/* Empty state */}
            {nodes.length === 0 && (
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
                    <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24" opacity="0.7">
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
