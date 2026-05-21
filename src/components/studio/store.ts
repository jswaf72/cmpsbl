import { create } from "zustand";
import {
  Node,
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import { StudioNodeData, PortDef, DataType, NodeCategory } from "./types";
import { NODE_TEMPLATES } from "./nodeTemplates";

export type StudioNode = Node<StudioNodeData>;
export type StudioEdge = Edge;

function canConnect(sourceType: DataType, targetType: DataType): boolean {
  if (sourceType === targetType) return true;
  if (sourceType === "object" || targetType === "object") return true;
  return false;
}

interface StudioState {
  nodes: StudioNode[];
  edges: StudioEdge[];
  selectedNodeId: string | null;
  customTemplates: typeof NODE_TEMPLATES;
  validationErrors: number;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => boolean;
  addNode: (templateId: string, position: { x: number; y: number }) => void;
  selectNode: (id: string | null) => void;
  updateNode: (id: string, data: Partial<StudioNodeData>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  addCustomTemplate: (template: (typeof NODE_TEMPLATES)[0]) => void;
  autoLayout: () => Promise<void>;
  validateEdges: () => void;
  getSelectedNode: () => StudioNode | null;
}

let nodeCounter = 0;

function makeNodeId() {
  return `node-${Date.now()}-${nodeCounter++}`;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  customTemplates: [],
  validationErrors: 0,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as unknown as StudioNode[] });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
    get().validateEdges();
  },

  onConnect: (connection) => {
    const { nodes, edges } = get();
    if (!connection.source || !connection.target) return false;

    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return false;

    const sourcePort = sourceNode.data.outputs.find(
      (p) => p.id === connection.sourceHandle
    );
    const targetPort = targetNode.data.inputs.find(
      (p) => p.id === connection.targetHandle
    );

    if (!sourcePort || !targetPort) return false;

    const compatible = canConnect(sourcePort.dataType, targetPort.dataType);

    const newEdge: StudioEdge = {
      id: `edge-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      data: {
        sourceType: sourcePort.dataType,
        targetType: targetPort.dataType,
        valid: compatible,
      },
      type: "smoothstep",
      animated: compatible,
      style: compatible
        ? { stroke: "#3b82f6", strokeWidth: 2 }
        : { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "6 3" },
    };

    set({ edges: addEdge(newEdge, edges) });
    get().validateEdges();
    return compatible;
  },

  addNode: (templateId, position) => {
    const allTemplates = [...NODE_TEMPLATES, ...get().customTemplates];
    const template = allTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const id = makeNodeId();
    const newNode: StudioNode = {
      id,
      type: "studioNode",
      position,
      data: {
        label: template.name,
        description: template.description,
        nodeType: template.nodeType,
        category: template.category,
        inputs: template.inputs.map((p) => ({ ...p })),
        outputs: template.outputs.map((p) => ({ ...p })),
        metadata: {},
        color: template.color,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    });
    get().validateEdges();
  },

  deleteNode: (id) => {
    const edges = get().edges.filter(
      (e) => e.source !== id && e.target !== id
    );
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges,
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
    get().validateEdges();
  },

  deleteEdge: (id) => {
    set({ edges: get().edges.filter((e) => e.id !== id) });
    get().validateEdges();
  },

  addCustomTemplate: (template) => {
    set({ customTemplates: [...get().customTemplates, template] });
  },

  validateEdges: () => {
    const { nodes, edges } = get();
    let errors = 0;
    const updatedEdges = edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) {
        errors++;
        return {
          ...edge,
          animated: false,
          style: { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "6 3" },
          data: { ...(edge.data || {}), valid: false },
        };
      }
      const sourcePort = sourceNode.data.outputs.find(
        (p) => p.id === edge.sourceHandle
      );
      const targetPort = targetNode.data.inputs.find(
        (p) => p.id === edge.targetHandle
      );
      if (!sourcePort || !targetPort) {
        errors++;
        return {
          ...edge,
          animated: false,
          style: { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "6 3" },
          data: { ...(edge.data || {}), valid: false },
        };
      }
      const valid = canConnect(sourcePort.dataType, targetPort.dataType);
      if (!valid) errors++;
      return {
        ...edge,
        animated: valid,
        style: valid
          ? { stroke: "#3b82f6", strokeWidth: 2 }
          : { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "6 3" },
        data: { ...(edge.data || {}), valid },
      };
    });
    set({ edges: updatedEdges, validationErrors: errors });
  },

  autoLayout: async () => {
    const { nodes, edges } = get();
    const dagre = await import("@dagrejs/dagre");
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 120 });

    nodes.forEach((node) => {
      g.setNode(node.id, { width: 220, height: 120 });
    });
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes = nodes.map((node) => {
      const pos = g.node(node.id);
      return {
        ...node,
        position: {
          x: pos.x - 110,
          y: pos.y - 60,
        },
      };
    });
    set({ nodes: layoutedNodes });
  },

  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) || null;
  },
}));
