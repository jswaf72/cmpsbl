import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { StudioNodeData } from "./types";
import { DATA_TYPE_COLORS, DATA_TYPE_LABELS } from "./types";
import { CATEGORY_COLORS } from "./nodeTemplates";

type StudioNodeProps = NodeProps & { data: StudioNodeData; selected: boolean };

export const StudioNode = memo(({ data, selected, id }: StudioNodeProps) => {
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);

  const categoryColor = CATEGORY_COLORS[data.category] || "#3b82f6";

  return (
    <div
      className="studio-node"
      style={{
        background: "#1a1f2e",
        border: selected
          ? "2px solid #3b82f6"
          : "1px solid #1f2535",
        borderRadius: "8px",
        minWidth: "200px",
        maxWidth: "260px",
        boxShadow: selected
          ? "0 0 0 3px rgba(59,130,246,0.25), 0 8px 32px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        fontFamily: "'Space Grotesk', sans-serif",
        overflow: "visible",
        position: "relative",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${categoryColor}22, ${categoryColor}11)`,
          borderBottom: `1px solid #1f2535`,
          padding: "10px 14px 8px",
          borderRadius: "8px 8px 0 0",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "3px",
            background: categoryColor,
            borderRadius: "8px 0 0 8px",
          }}
        />
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#e2e8f0",
            letterSpacing: "0.02em",
            marginLeft: "4px",
          }}
        >
          {data.label}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "4px",
            marginLeft: "4px",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              fontFamily: "'JetBrains Mono', monospace",
              color: categoryColor,
              background: `${categoryColor}18`,
              border: `1px solid ${categoryColor}40`,
              borderRadius: "3px",
              padding: "1px 5px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {data.nodeType}
          </span>
          <span
            style={{
              fontSize: "9px",
              color: "#475569",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {data.category}
          </span>
        </div>
      </div>

      {/* Ports */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
          minHeight: "40px",
        }}
      >
        {/* Input Ports */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {data.inputs.map((port) => {
            const color = DATA_TYPE_COLORS[port.dataType];
            const isHovered = hoveredPort === `in-${port.id}`;
            return (
              <div
                key={port.id}
                style={{ position: "relative", display: "flex", alignItems: "center" }}
                onMouseEnter={() => setHoveredPort(`in-${port.id}`)}
                onMouseLeave={() => setHoveredPort(null)}
              >
                <Handle
                  type="target"
                  position={Position.Left}
                  id={port.id}
                  style={{
                    position: "relative",
                    left: "-6px",
                    width: "12px",
                    height: "12px",
                    background: color,
                    border: `2px solid ${color}88`,
                    borderRadius: "50%",
                    boxShadow: isHovered ? `0 0 8px ${color}` : "none",
                    transition: "box-shadow 0.2s",
                    zIndex: 10,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    fontFamily: "'JetBrains Mono', monospace",
                    paddingLeft: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {port.label}
                </span>
                {/* Tooltip */}
                {isHovered && (
                  <div
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      marginLeft: "8px",
                      background: "#0d0f14",
                      border: `1px solid ${color}60`,
                      borderRadius: "4px",
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                      zIndex: 1000,
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ color, fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                      {DATA_TYPE_LABELS[port.dataType]}
                    </span>
                    <span style={{ color: "#475569", fontSize: "10px", marginLeft: "4px" }}>
                      {port.cardinality}
                    </span>
                    {port.required && (
                      <span style={{ color: "#ef4444", fontSize: "10px", marginLeft: "4px" }}>*</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Output Ports */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, alignItems: "flex-end" }}>
          {data.outputs.map((port) => {
            const color = DATA_TYPE_COLORS[port.dataType];
            const isHovered = hoveredPort === `out-${port.id}`;
            return (
              <div
                key={port.id}
                style={{ position: "relative", display: "flex", alignItems: "center" }}
                onMouseEnter={() => setHoveredPort(`out-${port.id}`)}
                onMouseLeave={() => setHoveredPort(null)}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    fontFamily: "'JetBrains Mono', monospace",
                    paddingRight: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {port.label}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={port.id}
                  style={{
                    position: "relative",
                    right: "-6px",
                    width: "12px",
                    height: "12px",
                    background: color,
                    border: `2px solid ${color}88`,
                    borderRadius: "50%",
                    boxShadow: isHovered ? `0 0 8px ${color}` : "none",
                    transition: "box-shadow 0.2s",
                    zIndex: 10,
                    flexShrink: 0,
                  }}
                />
                {/* Tooltip */}
                {isHovered && (
                  <div
                    style={{
                      position: "absolute",
                      right: "100%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      marginRight: "8px",
                      background: "#0d0f14",
                      border: `1px solid ${color}60`,
                      borderRadius: "4px",
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                      zIndex: 1000,
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ color, fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                      {DATA_TYPE_LABELS[port.dataType]}
                    </span>
                    <span style={{ color: "#475569", fontSize: "10px", marginLeft: "4px" }}>
                      {port.cardinality}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

StudioNode.displayName = "StudioNode";
