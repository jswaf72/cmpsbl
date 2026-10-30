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
  Sun,
  Moon,
  Printer,
} from "lucide-react";
import { useStudioStore } from "./store";
import { useReactFlow } from "@xyflow/react";
import { ThemeMode, THEME_ORDER, Lens, LENS_ORDER, LENSES } from "./theme";

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
  const themeMode = useStudioStore((s) => s.themeMode);
  const setThemeMode = useStudioStore((s) => s.setThemeMode);
  const activeLens = useStudioStore((s) => s.activeLens);
  const setActiveLens = useStudioStore((s) => s.setActiveLens);
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div
      style={{
        height: "52px",
        background: "var(--studio-surface)",
        borderBottom: "1px solid var(--studio-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: "8px",
        flexShrink: 0,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "12px",
        }}
      >
        <span
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "var(--studio-text)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "'Archivo Narrow', sans-serif",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          CMPSBL
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "24px", background: "var(--studio-border)" }} />

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
            <svg width="11" height="11" fill="none" stroke="var(--studio-accent)" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M3 7a2 2 0 012-2h3l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--studio-accent-soft)",
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
                color: saveMsg === "Saved" ? "var(--studio-success)" : "var(--studio-error)",
                letterSpacing: "0.04em",
              }}
            >
              {saveMsg}
            </span>
          )}
          <div style={{ width: "1px", height: "24px", background: "var(--studio-border)" }} />
        </>
      )}

      {/* Action Buttons */}
      <ToolbarButton icon={<FilePlus size={14} />} label="New" onClick={onNew} />
      <ToolbarButton icon={<Save size={14} />} label={saving ? "Saving…" : "Save"} onClick={onSave} />
      <ToolbarButton icon={<Download size={14} />} label="Export" onClick={onExport} />

      <div style={{ width: "1px", height: "24px", background: "var(--studio-border)" }} />

      <ToolbarButton
        icon={<LayoutDashboard size={14} />}
        label="Auto-Layout"
        onClick={onAutoLayout}
        accent
      />

      <div style={{ flex: 1 }} />

      {/* Lens selector */}
      <LensSelect value={activeLens} onChange={setActiveLens} />

      {/* Theme switch */}
      <ThemeSwitch value={themeMode} onChange={setThemeMode} />

      <div style={{ width: "1px", height: "24px", background: "var(--studio-border)" }} />

      {/* Zoom Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          background: "var(--studio-bg)",
          border: "1px solid var(--studio-border)",
          borderRadius: "7px",
          padding: "3px",
        }}
      >
        <ZoomButton icon={<ZoomOut size={13} />} onClick={() => zoomOut()} title="Zoom out" />
        <ZoomButton icon={<ZoomIn size={13} />} onClick={() => zoomIn()} title="Zoom in" />
        <ZoomButton icon={<Maximize2 size={13} />} onClick={() => fitView()} title="Fit view" />
      </div>

      <div style={{ width: "1px", height: "24px", background: "var(--studio-border)" }} />

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
              style={{ width: "13px", height: "13px", color: "var(--studio-error)" }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--studio-error)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {validationErrors} error{validationErrors !== 1 ? "s" : ""}
            </span>
          </>
        ) : (
          <>
            <CheckCircle2
              style={{ width: "13px", height: "13px", color: "var(--studio-success)" }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--studio-success)",
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
            : "var(--studio-hover)"
          : accent
          ? "rgba(59,130,246,0.1)"
          : "transparent",
        border: accent ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
        borderRadius: "6px",
        cursor: "pointer",
        color: accent ? "var(--studio-accent)" : "var(--studio-text-muted)",
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
        background: hovered ? "var(--studio-hover)" : "transparent",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        color: hovered ? "var(--studio-text-muted)" : "var(--studio-text-faint)",
        transition: "all 0.15s",
      }}
    >
      {icon}
    </button>
  );
}

const THEME_ICONS: Record<ThemeMode, React.ReactNode> = {
  dark: <Moon size={13} />,
  light: <Sun size={13} />,
  print: <Printer size={13} />,
};

function ThemeSwitch({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (m: ThemeMode) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        background: "var(--studio-bg)",
        border: "1px solid var(--studio-border)",
        borderRadius: "7px",
        padding: "3px",
      }}
    >
      {THEME_ORDER.map((mode) => {
        const active = mode === value;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            title={`${mode[0].toUpperCase()}${mode.slice(1)} theme`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "26px",
              height: "26px",
              background: active ? "rgba(59,130,246,0.18)" : "transparent",
              border: active
                ? "1px solid rgba(59,130,246,0.35)"
                : "1px solid transparent",
              borderRadius: "5px",
              cursor: "pointer",
              color: active ? "var(--studio-accent)" : "var(--studio-text-faint)",
              transition: "all 0.15s",
            }}
          >
            {THEME_ICONS[mode]}
          </button>
        );
      })}
    </div>
  );
}

function LensSelect({
  value,
  onChange,
}: {
  value: Lens;
  onChange: (l: Lens) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Lens)}
      title={LENSES[value].description}
      style={{
        height: "30px",
        background: "var(--studio-bg)",
        color: "var(--studio-text-muted)",
        border: "1px solid var(--studio-border)",
        borderRadius: "7px",
        padding: "0 8px",
        fontSize: "11px",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.04em",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {LENS_ORDER.map((lens) => (
        <option key={lens} value={lens}>
          {`Lens: ${LENSES[lens].label}`}
        </option>
      ))}
    </select>
  );
}
