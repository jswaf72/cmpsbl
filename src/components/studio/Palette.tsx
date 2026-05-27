import React, { useState, useMemo } from "react";
import { Search, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { NODE_TEMPLATES, CATEGORY_COLORS } from "./nodeTemplates";
import { NodeCategory, NodeTemplate } from "./types";
import { useStudioStore } from "./store";

const CATEGORIES: NodeCategory[] = [
  "Transformations",
  "Inputs",
  "Outputs",
  "Utilities",
  "Logic",
  "Data",
  "State",
  "Network / IO",
  "Process",
  "Infrastructure",
  "AI / ML",
  "Music",
  "Aggregations",
  "Monitoring",
];

interface PaletteProps {
  onDragStart: (templateId: string) => void;
  onNewNode: () => void;
}

export function Palette({ onDragStart, onNewNode }: PaletteProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c, true]))
  );
  const customTemplates = useStudioStore((s) => s.customTemplates);

  const allTemplates = useMemo(
    () => [...NODE_TEMPLATES, ...customTemplates],
    [customTemplates]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allTemplates;
    return allTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.nodeType.toLowerCase().includes(q)
    );
  }, [search, allTemplates]);

  // When searching, show all matched categories expanded
  const effectiveCollapsed = useMemo(() => {
    if (search.trim()) return {};
    return collapsed;
  }, [search, collapsed]);

  const byCategory = useMemo(() => {
    const map: Record<string, NodeTemplate[]> = {};
    CATEGORIES.forEach((c) => {
      const items = filtered.filter((t) => t.category === c);
      if (items.length > 0) map[c] = items;
    });
    return map;
  }, [filtered]);

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div
      style={{
        width: "240px",
        height: "100%",
        background: "#13161f",
        borderRight: "1px solid #1f2535",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 14px 12px",
          borderBottom: "1px solid #1f2535",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#3b82f6",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "10px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Node Palette
        </div>
        <div style={{ position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "14px",
              height: "14px",
              color: "#475569",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes…"
            style={{
              width: "100%",
              background: "#0d0f14",
              border: "1px solid #1f2535",
              borderRadius: "6px",
              padding: "7px 10px 7px 30px",
              fontSize: "12px",
              color: "#e2e8f0",
              outline: "none",
              fontFamily: "'Outfit', sans-serif",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#1f2535";
            }}
          />
        </div>
      </div>

      {/* Node List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 0",
        }}
      >
        {Object.entries(byCategory).map(([category, templates]) => {
          const color = CATEGORY_COLORS[category] || "#3b82f6";
          const isCollapsed = effectiveCollapsed[category];
          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {isCollapsed ? (
                  <ChevronRight style={{ width: "12px", height: "12px", color }} />
                ) : (
                  <ChevronDown style={{ width: "12px", height: "12px", color }} />
                )}
                <span style={{ color }}>{category}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    background: `${color}22`,
                    color,
                    borderRadius: "3px",
                    padding: "0 5px",
                    fontSize: "9px",
                  }}
                >
                  {templates.length}
                </span>
              </button>
              {!isCollapsed &&
                templates.map((template) => (
                  <PaletteItem
                    key={template.id}
                    template={template}
                    color={color}
                    onDragStart={onDragStart}
                  />
                ))}
            </div>
          );
        })}

        {Object.keys(byCategory).length === 0 && (
          <div
            style={{
              padding: "20px 14px",
              color: "#475569",
              fontSize: "12px",
              textAlign: "center",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            No nodes match "{search}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid #1f2535",
        }}
      >
        <button
          onClick={onNewNode}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px",
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "6px",
            color: "#3b82f6",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(59,130,246,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(59,130,246,0.12)";
          }}
        >
          <Plus style={{ width: "14px", height: "14px" }} />
          New Node Type
        </button>
      </div>
    </div>
  );
}

function PaletteItem({
  template,
  color,
  onDragStart,
}: {
  template: NodeTemplate;
  color: string;
  onDragStart: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(template.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 14px 7px 20px",
        cursor: "grab",
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        transition: "background 0.15s, padding-left 0.15s",
        paddingLeft: hovered ? "24px" : "20px",
      }}
    >
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
          boxShadow: hovered ? `0 0 6px ${color}` : "none",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: hovered ? "#e2e8f0" : "#94a3b8",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {template.name}
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "#475569",
            fontFamily: "'JetBrains Mono', monospace",
            display: "flex",
            gap: "6px",
            marginTop: "1px",
          }}
        >
          <span>{template.inputs.length}→</span>
          <span>→{template.outputs.length}</span>
        </div>
      </div>
      <span
        style={{
          fontSize: "9px",
          color,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          borderRadius: "3px",
          padding: "1px 5px",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}
      >
        {template.nodeType}
      </span>
    </div>
  );
}
