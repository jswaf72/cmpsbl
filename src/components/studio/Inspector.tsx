import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useStudioStore } from "./store";
import {
  DataType,
  PortDef,
  NodeCategory,
  DATA_TYPE_COLORS,
  DATA_TYPE_LABELS,
} from "./types";
import { CATEGORY_COLORS } from "./nodeTemplates";

const DATA_TYPES: DataType[] = [
  "string",
  "number",
  "boolean",
  "event",
  "ingredient",
  "liquid",
  "heat",
  "signal",
  "object",
];

const NODE_CATEGORIES: NodeCategory[] = [
  "Transformations",
  "Inputs",
  "Outputs",
  "Utilities",
  "Logic",
  "Data",
  "State",
];

const NODE_TYPES = [
  "transform",
  "input",
  "output",
  "utility",
  "logic",
  "data",
  "state",
];

function generatePortId() {
  return `port-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface InspectorProps {
  isNewNodeMode?: boolean;
  onNewNodeSave?: () => void;
  onClose: () => void;
}

export function Inspector({ isNewNodeMode, onNewNodeSave, onClose }: InspectorProps) {
  const selectedNode = useStudioStore((s) => s.getSelectedNode());
  const updateNode = useStudioStore((s) => s.updateNode);
  const deleteNode = useStudioStore((s) => s.deleteNode);
  const addCustomTemplate = useStudioStore((s) => s.addCustomTemplate);
  const edges = useStudioStore((s) => s.edges);

  const [newNodeForm, setNewNodeForm] = useState({
    name: "",
    nodeType: "transform",
    category: "Transformations" as NodeCategory,
    description: "",
    inputs: [] as PortDef[],
    outputs: [] as PortDef[],
  });

  const [metaKey, setMetaKey] = useState("");
  const [metaVal, setMetaVal] = useState("");

  if (isNewNodeMode) {
    return (
      <NewNodeForm
        form={newNodeForm}
        setForm={setNewNodeForm}
        onSave={() => {
          const template = {
            id: `custom-${Date.now()}`,
            name: newNodeForm.name || "Custom Node",
            category: newNodeForm.category,
            nodeType: newNodeForm.nodeType,
            description: newNodeForm.description,
            inputs: newNodeForm.inputs,
            outputs: newNodeForm.outputs,
          };
          addCustomTemplate(template);
          onNewNodeSave?.();
        }}
        onClose={onClose}
      />
    );
  }

  if (!selectedNode) {
    return (
      <EmptyInspector onClose={onClose} />
    );
  }

  const { data, id } = selectedNode;
  const connectedEdges = edges.filter(
    (e) => e.source === id || e.target === id
  );

  const updateField = (field: string, value: unknown) => {
    updateNode(id, { [field]: value });
  };

  const updatePort = (
    kind: "inputs" | "outputs",
    portId: string,
    field: string,
    value: unknown
  ) => {
    const ports = data[kind].map((p) =>
      p.id === portId ? { ...p, [field]: value } : p
    );
    updateNode(id, { [kind]: ports });
  };

  const addPort = (kind: "inputs" | "outputs") => {
    const newPort: PortDef = {
      id: generatePortId(),
      label: "New Port",
      dataType: "object",
      cardinality: "one",
      required: false,
    };
    updateNode(id, { [kind]: [...data[kind], newPort] });
  };

  const removePort = (kind: "inputs" | "outputs", portId: string) => {
    updateNode(id, { [kind]: data[kind].filter((p) => p.id !== portId) });
  };

  const addMeta = () => {
    if (!metaKey) return;
    updateNode(id, {
      metadata: { ...data.metadata, [metaKey]: metaVal },
    });
    setMetaKey("");
    setMetaVal("");
  };

  const removeMeta = (key: string) => {
    const { [key]: _, ...rest } = data.metadata;
    updateNode(id, { metadata: rest });
  };

  const handleDelete = () => {
    if (
      connectedEdges.length > 0 &&
      !window.confirm(
        `This node has ${connectedEdges.length} connection(s). Delete anyway?`
      )
    )
      return;
    deleteNode(id);
    onClose();
  };

  const categoryColor = CATEGORY_COLORS[data.category] || "#3b82f6";

  return (
    <div
      style={{
        width: "300px",
        height: "100%",
        background: "#13161f",
        borderLeft: "1px solid #1f2535",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: "1px solid #1f2535",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${categoryColor}15, transparent)`,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#3b82f6",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: "2px",
            }}
          >
            Inspector
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0" }}>
            {data.label}
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={handleDelete}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "6px",
              padding: "5px",
              cursor: "pointer",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
            }}
            title="Delete node"
          >
            <Trash2 style={{ width: "13px", height: "13px" }} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #1f2535",
              borderRadius: "6px",
              padding: "5px",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X style={{ width: "13px", height: "13px" }} />
          </button>
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Label */}
        <Field label="Label">
          <TextInput
            value={data.label}
            onChange={(v) => updateField("label", v)}
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={2}
            style={inputStyle}
          />
        </Field>

        {/* Node Type */}
        <Field label="Node Type">
          <SelectInput
            value={data.nodeType}
            options={NODE_TYPES}
            onChange={(v) => updateField("nodeType", v)}
          />
        </Field>

        {/* Category */}
        <Field label="Category">
          <SelectInput
            value={data.category}
            options={NODE_CATEGORIES}
            onChange={(v) => updateField("category", v as NodeCategory)}
          />
        </Field>

        {/* Input Ports */}
        <PortSection
          title="Input Ports"
          ports={data.inputs}
          kind="inputs"
          onAdd={() => addPort("inputs")}
          onRemove={(id) => removePort("inputs", id)}
          onUpdate={(portId, field, val) => updatePort("inputs", portId, field, val)}
        />

        {/* Output Ports */}
        <PortSection
          title="Output Ports"
          ports={data.outputs}
          kind="outputs"
          onAdd={() => addPort("outputs")}
          onRemove={(id) => removePort("outputs", id)}
          onUpdate={(portId, field, val) => updatePort("outputs", portId, field, val)}
        />

        {/* Metadata */}
        <div>
          <SectionLabel>Metadata</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
            {Object.entries(data.metadata).map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#0d0f14",
                  borderRadius: "4px",
                  padding: "5px 8px",
                  border: "1px solid #1f2535",
                }}
              >
                <span
                  style={{
                    color: "#3b82f6",
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    flex: 1,
                  }}
                >
                  {key}:
                </span>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    flex: 1,
                  }}
                >
                  {val}
                </span>
                <button
                  onClick={() => removeMeta(key)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#475569",
                    padding: "0",
                    display: "flex",
                  }}
                >
                  <X style={{ width: "11px", height: "11px" }} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              value={metaKey}
              onChange={(e) => setMetaKey(e.target.value)}
              placeholder="key"
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              value={metaVal}
              onChange={(e) => setMetaVal(e.target.value)}
              placeholder="value"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={addMeta}
              style={{
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: "5px",
                padding: "5px 8px",
                color: "#3b82f6",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Plus style={{ width: "12px", height: "12px" }} />
            </button>
          </div>
        </div>

        {/* Node ID */}
        <div
          style={{
            fontSize: "10px",
            color: "#334155",
            fontFamily: "'JetBrains Mono', monospace",
            paddingTop: "4px",
            borderTop: "1px solid #1f2535",
          }}
        >
          id: {id}
        </div>
      </div>
    </div>
  );
}

function EmptyInspector({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        width: "300px",
        height: "100%",
        background: "#13161f",
        borderLeft: "1px solid #1f2535",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <svg width="22" height="22" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
      </div>
      <div style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>
        Select a node to inspect
      </div>
      <div style={{ color: "#334155", fontSize: "11px", marginTop: "4px", textAlign: "center" }}>
        Click any node on the canvas
      </div>
    </div>
  );
}

function NewNodeForm({
  form,
  setForm,
  onSave,
  onClose,
}: {
  form: any;
  setForm: (f: any) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const addPort = (kind: "inputs" | "outputs") => {
    const newPort: PortDef = {
      id: generatePortId(),
      label: "Port",
      dataType: "object",
      cardinality: "one",
      required: false,
    };
    setForm({ ...form, [kind]: [...form[kind], newPort] });
  };

  const removePort = (kind: "inputs" | "outputs", portId: string) => {
    setForm({ ...form, [kind]: form[kind].filter((p: PortDef) => p.id !== portId) });
  };

  const updatePort = (kind: "inputs" | "outputs", portId: string, field: string, value: unknown) => {
    const ports = form[kind].map((p: PortDef) =>
      p.id === portId ? { ...p, [field]: value } : p
    );
    setForm({ ...form, [kind]: ports });
  };

  return (
    <div
      style={{
        width: "300px",
        height: "100%",
        background: "#13161f",
        borderLeft: "1px solid #1f2535",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: "1px solid #1f2535",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
            New Node Type
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "1px" }}>
            Define a custom node
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid #1f2535",
            borderRadius: "6px",
            padding: "5px",
            cursor: "pointer",
            color: "#64748b",
            display: "flex",
          }}
        >
          <X style={{ width: "13px", height: "13px" }} />
        </button>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <Field label="Node Name">
          <TextInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="My Node" />
        </Field>
        <Field label="Node Type">
          <SelectInput value={form.nodeType} options={NODE_TYPES} onChange={(v) => setForm({ ...form, nodeType: v })} />
        </Field>
        <Field label="Category">
          <SelectInput value={form.category} options={NODE_CATEGORIES} onChange={(v) => setForm({ ...form, category: v })} />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={inputStyle} />
        </Field>
        <PortSection
          title="Input Ports"
          ports={form.inputs}
          kind="inputs"
          onAdd={() => addPort("inputs")}
          onRemove={(id) => removePort("inputs", id)}
          onUpdate={(portId, field, val) => updatePort("inputs", portId, field, val)}
        />
        <PortSection
          title="Output Ports"
          ports={form.outputs}
          kind="outputs"
          onAdd={() => addPort("outputs")}
          onRemove={(id) => removePort("outputs", id)}
          onUpdate={(portId, field, val) => updatePort("outputs", portId, field, val)}
        />
        <button
          onClick={onSave}
          style={{
            width: "100%",
            padding: "9px",
            background: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.4)",
            borderRadius: "6px",
            color: "#34d399",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Save to Palette
        </button>
      </div>
    </div>
  );
}

function PortSection({
  title,
  ports,
  kind,
  onAdd,
  onRemove,
  onUpdate,
}: {
  title: string;
  ports: PortDef[];
  kind: "inputs" | "outputs";
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (portId: string, field: string, value: unknown) => void;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <SectionLabel>{title}</SectionLabel>
        <button
          onClick={onAdd}
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: "4px",
            padding: "2px 6px",
            color: "#3b82f6",
            fontSize: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <Plus style={{ width: "10px", height: "10px" }} />
          Add
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {ports.map((port) => (
          <PortEditor
            key={port.id}
            port={port}
            onRemove={() => onRemove(port.id)}
            onUpdate={(field, val) => onUpdate(port.id, field, val)}
          />
        ))}
        {ports.length === 0 && (
          <div style={{ color: "#334155", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", padding: "4px 0" }}>
            No ports defined
          </div>
        )}
      </div>
    </div>
  );
}

function PortEditor({
  port,
  onRemove,
  onUpdate,
}: {
  port: PortDef;
  onRemove: () => void;
  onUpdate: (field: string, value: unknown) => void;
}) {
  const color = DATA_TYPE_COLORS[port.dataType];

  return (
    <div
      style={{
        background: "#0d0f14",
        border: `1px solid ${color}28`,
        borderRadius: "6px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <input
          value={port.label}
          onChange={(e) => onUpdate("label", e.target.value)}
          style={{ ...inputStyle, flex: 1, fontSize: "11px", padding: "3px 7px" }}
          placeholder="Port label"
        />
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#475569",
            padding: "2px",
            display: "flex",
          }}
        >
          <Trash2 style={{ width: "11px", height: "11px" }} />
        </button>
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "9px", color: "#475569", marginBottom: "3px", fontFamily: "'JetBrains Mono', monospace" }}>TYPE</div>
          <select
            value={port.dataType}
            onChange={(e) => onUpdate("dataType", e.target.value)}
            style={{ ...selectStyle, width: "100%" }}
          >
            {DATA_TYPES.map((t) => (
              <option key={t} value={t}>
                {DATA_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "9px", color: "#475569", marginBottom: "3px", fontFamily: "'JetBrains Mono', monospace" }}>CARD.</div>
          <select
            value={port.cardinality}
            onChange={(e) => onUpdate("cardinality", e.target.value)}
            style={{ ...selectStyle, width: "100%" }}
          >
            <option value="one">One</option>
            <option value="many">Many</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={() => onUpdate("required", !port.required)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {port.required ? (
            <ToggleRight style={{ width: "18px", height: "18px", color: "#3b82f6" }} />
          ) : (
            <ToggleLeft style={{ width: "18px", height: "18px", color: "#334155" }} />
          )}
          <span style={{ fontSize: "10px", color: port.required ? "#3b82f6" : "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
            Required
          </span>
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#131621",
  border: "1px solid #1f2535",
  borderRadius: "5px",
  padding: "6px 10px",
  fontSize: "12px",
  color: "#e2e8f0",
  outline: "none",
  fontFamily: "'Outfit', sans-serif",
  width: "100%",
  boxSizing: "border-box",
  resize: "vertical" as const,
};

const selectStyle: React.CSSProperties = {
  background: "#131621",
  border: "1px solid #1f2535",
  borderRadius: "5px",
  padding: "5px 8px",
  fontSize: "11px",
  color: "#e2e8f0",
  outline: "none",
  fontFamily: "'JetBrains Mono', monospace",
  cursor: "pointer",
  boxSizing: "border-box" as const,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "#475569",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          marginBottom: "5px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: 700,
        color: "#64748b",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

function SelectInput({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...selectStyle, width: "100%" }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
