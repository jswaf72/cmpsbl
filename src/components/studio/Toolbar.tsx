import React from "react";
import {
  FilePlus,
  Save,
  Download,
  LayoutDashboard,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useStudioStore } from "./store";
import { useReactFlow } from "@xyflow/react";

interface ToolbarProps {
  onNew: () => void;
  onSave: () => void;
  onExport: () => void;
  onAutoLayout: () => void;
  projectName?: string;
  saving?: boolean;
  saveMsg?: string | null;
}

export function Toolbar({ onNew, onSave, onExport, onAutoLayout, projectName, saving, saveMsg }: ToolbarProps) {
  const validationErrors = useStudioStore((s) => s.validationErrors);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div
      style={{
        height: "52px",
        background: "#13161f",
        borderBottom: "1px solid #1f2535",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: "8px",
        flexShrink: 0,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginRight: "12px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="18" cy="18" r="3" />
            <path d="M9 12h6M15 7.5L9 12M15 16.5L9 12" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#e2e8f0",
              letterSpacing: "0.01em",
              fontFamily: "'Space Grotesk', sans-serif",
              lineHeight: 1,
            }}
          >
            Composable Systems
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "#3b82f6",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Studio
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "24px", background: "#1f2535" }} />

      {/* Project name */}
      {projectName && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: "rgba(59,130,246,0.07)",
              border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: "6px",
              maxWidth: "160px",
            }}
          >
            <svg width="11" height="11" fill="none" stroke="#3b82f6" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#7dd3fc",
                fontFamily: "'Space Grotesk', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {projectName}
            </span>
          </div>
          {saveMsg && (
            <span
              style={{
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                color: saveMsg === "Saved" ? "#22c55e" : "#ef4444",
                letterSpacing: "0.04em",
              }}
            >
              {saveMsg}
            </span>
          )}
          <div style={{ width: "1px", height: "24px", background: "#1f2535" }} />
        </>
      )}

      {/* Action Buttons */}
      <ToolbarButton icon={<FilePlus size={14} />} label="New" onClick={onNew} />
      <ToolbarButton icon={<Save size={14} />} label={saving ? "Saving…" : "Save"} onClick={onSave} />
      <ToolbarButton icon={<Download size={14} />} label="Export" onClick={onExport} />

      <div style={{ width: "1px", height: "24px", background: "#1f2535" }} />

      <ToolbarButton
        icon={<LayoutDashboard size={14} />}
        label="Auto-Layout"
        onClick={onAutoLayout}
        accent
      />

      <div style={{ flex: 1 }} />

      {/* Zoom Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          background: "#0d0f14",
          border: "1px solid #1f2535",
          borderRadius: "7px",
          padding: "3px",
        }}
      >
        <ZoomButton icon={<ZoomOut size={13} />} onClick={() => zoomOut()} title="Zoom out" />
        <ZoomButton icon={<ZoomIn size={13} />} onClick={() => zoomIn()} title="Zoom in" />
        <ZoomButton icon={<Maximize2 size={13} />} onClick={() => fitView()} title="Fit view" />
      </div>

      <div style={{ width: "1px", height: "24px", background: "#1f2535" }} />

      {/* Validation Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 12px",
          borderRadius: "7px",
          background:
            validationErrors > 0
              ? "rgba(239,68,68,0.1)"
              : "rgba(34,197,94,0.1)",
          border:
            validationErrors > 0
              ? "1px solid rgba(239,68,68,0.3)"
              : "1px solid rgba(34,197,94,0.3)",
          transition: "all 0.3s",
        }}
      >
        {validationErrors > 0 ? (
          <>
            <AlertTriangle
              style={{ width: "13px", height: "13px", color: "#ef4444" }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#ef4444",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {validationErrors} error{validationErrors !== 1 ? "s" : ""}
            </span>
          </>
        ) : (
          <>
            <CheckCircle2
              style={{ width: "13px", height: "13px", color: "#22c55e" }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#22c55e",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              valid
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px",
        background: hovered
          ? accent
            ? "rgba(59,130,246,0.2)"
            : "rgba(255,255,255,0.06)"
          : accent
          ? "rgba(59,130,246,0.1)"
          : "transparent",
        border: accent ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
        borderRadius: "6px",
        cursor: "pointer",
        color: accent ? "#3b82f6" : "#94a3b8",
        fontSize: "12px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 500,
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function ZoomButton({
  icon,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "26px",
        height: "26px",
        background: hovered ? "rgba(255,255,255,0.07)" : "transparent",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        color: hovered ? "#94a3b8" : "#475569",
        transition: "all 0.15s",
      }}
    >
      {icon}
    </button>
  );
}
