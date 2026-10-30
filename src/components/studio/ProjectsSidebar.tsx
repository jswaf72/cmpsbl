import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  FolderPlus,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProject,
  Project,
} from "@/lib/supabase";

interface ProjectsSidebarProps {
  currentProjectId: string | null;
  onSelectProject: (project: Project) => void;
  // View: "projects" = main menu, "palette" = node palette level
  view: "projects" | "palette";
  setView: (v: "projects" | "palette") => void;
  // Palette slot: renders the palette content (passed from parent)
  paletteContent: React.ReactNode;
}

export function ProjectsSidebar({
  currentProjectId,
  onSelectProject,
  view,
  setView,
  paletteContent,
}: ProjectsSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [savingNew, setSavingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "projects") {
      load();
    }
  }, [view, load]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSavingNew(true);
    try {
      const proj = await createProject(newName.trim(), newDesc.trim());
      setProjects((prev) => [proj, ...prev]);
      setCreatingNew(false);
      setNewName("");
      setNewDesc("");
      onSelectProject(proj);
      setView("palette");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setSavingNew(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProjectId === id) {
        onSelectProject(null as unknown as Project);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSave = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateProject(id, { name: editName.trim() });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: editName.trim() } : p))
      );
      setEditingId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to rename project");
    }
  };

  const currentProject = projects.find((p) => p.id === currentProjectId);

  // ─── Palette view (second level) ────────────────────────────────────────────
  if (view === "palette") {
    return (
      <div
        style={{
          width: "240px",
          height: "100%",
          background: "var(--studio-surface)",
          borderRight: "1px solid var(--studio-border)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Breadcrumb header */}
        <div
          style={{
            padding: "10px 14px 8px",
            borderBottom: "1px solid var(--studio-border)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setView("projects")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--studio-text-faint)",
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              padding: "0 0 6px",
              letterSpacing: "0.04em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--studio-text-muted)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--studio-text-faint)")
            }
          >
            <ChevronLeft style={{ width: "12px", height: "12px" }} />
            All Projects
          </button>
          {/* Current project name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FolderOpen
              style={{ width: "14px", height: "14px", color: "var(--studio-accent)", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--studio-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentProject?.name ?? "Untitled Project"}
            </span>
          </div>
        </div>

        {/* Palette content fills the rest */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {paletteContent}
        </div>
      </div>
    );
  }

  // ─── Projects main menu ──────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: "240px",
        height: "100%",
        background: "var(--studio-surface)",
        borderRight: "1px solid var(--studio-border)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 14px 12px",
          borderBottom: "1px solid var(--studio-border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--studio-accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Projects
          </div>
          <button
            onClick={() => {
              setCreatingNew(true);
              setNewName("");
              setNewDesc("");
            }}
            title="New Project"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: "5px",
              cursor: "pointer",
              color: "var(--studio-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(59,130,246,0.22)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(59,130,246,0.12)")
            }
          >
            <Plus style={{ width: "13px", height: "13px" }} />
          </button>
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--studio-text-faint)",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Select a project to open its canvas
        </div>
      </div>

      {/* New project form */}
      {creatingNew && (
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid var(--studio-border)",
            background: "rgba(59,130,246,0.05)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--studio-accent)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            New Project
          </div>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setCreatingNew(false);
            }}
            placeholder="Project name…"
            style={{
              width: "100%",
              background: "var(--studio-bg)",
              border: "1px solid var(--studio-border)",
              borderRadius: "5px",
              padding: "6px 10px",
              fontSize: "12px",
              color: "var(--studio-text)",
              outline: "none",
              fontFamily: "'Outfit', sans-serif",
              boxSizing: "border-box",
              marginBottom: "6px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--studio-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--studio-border)")}
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)…"
            style={{
              width: "100%",
              background: "var(--studio-bg)",
              border: "1px solid var(--studio-border)",
              borderRadius: "5px",
              padding: "6px 10px",
              fontSize: "11px",
              color: "var(--studio-text-muted)",
              outline: "none",
              fontFamily: "'Outfit', sans-serif",
              boxSizing: "border-box",
              marginBottom: "8px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--studio-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--studio-border)")}
          />
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={handleCreate}
              disabled={savingNew || !newName.trim()}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: "6px 8px",
                background: "rgba(59,130,246,0.18)",
                border: "1px solid rgba(59,130,246,0.35)",
                borderRadius: "5px",
                color: "var(--studio-accent)",
                fontSize: "11px",
                fontWeight: 600,
                cursor: savingNew || !newName.trim() ? "not-allowed" : "pointer",
                opacity: !newName.trim() ? 0.5 : 1,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {savingNew ? (
                <Loader2
                  style={{ width: "11px", height: "11px", animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Check style={{ width: "11px", height: "11px" }} />
              )}
              Create
            </button>
            <button
              onClick={() => setCreatingNew(false)}
              style={{
                padding: "6px 10px",
                background: "transparent",
                border: "1px solid var(--studio-border)",
                borderRadius: "5px",
                color: "var(--studio-text-faint)",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              <X style={{ width: "11px", height: "11px" }} />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "8px 14px",
            background: "rgba(239,68,68,0.08)",
            borderBottom: "1px solid rgba(239,68,68,0.2)",
            color: "var(--studio-error)",
            fontSize: "11px",
            fontFamily: "'Outfit', sans-serif",
            flexShrink: 0,
          }}
        >
          {error}
        </div>
      )}

      {/* Project list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "24px",
              color: "var(--studio-text-faint)",
              fontSize: "12px",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <Loader2
              style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }}
            />
            Loading…
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "var(--studio-faint)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <FolderPlus
              style={{
                width: "32px",
                height: "32px",
                color: "var(--studio-border)",
                margin: "0 auto 12px",
                display: "block",
              }}
            />
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--studio-text-faint)", marginBottom: "4px" }}>
              No projects yet
            </div>
            <div style={{ fontSize: "11px", color: "var(--studio-faint)" }}>
              Click + to create your first project
            </div>
          </div>
        )}

        {!loading &&
          projects.map((project) => {
            const isActive = project.id === currentProjectId;
            const isEditing = editingId === project.id;
            const isDeleting = deletingId === project.id;
            const isHovered = hoveredId === project.id;

            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  background: isActive
                    ? "rgba(59,130,246,0.1)"
                    : isHovered
                    ? "rgba(255,255,255,0.03)"
                    : "transparent",
                  borderLeft: isActive ? "2px solid var(--studio-accent)" : "2px solid transparent",
                  transition: "background 0.15s",
                }}
              >
                {isEditing ? (
                  <div style={{ padding: "8px 12px", display: "flex", gap: "6px" }}>
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave(project.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      style={{
                        flex: 1,
                        background: "var(--studio-bg)",
                        border: "1px solid var(--studio-accent)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        color: "var(--studio-text)",
                        outline: "none",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    />
                    <button
                      onClick={() => handleEditSave(project.id)}
                      style={{
                        background: "rgba(59,130,246,0.15)",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "var(--studio-accent)",
                        padding: "4px",
                      }}
                    >
                      <Check style={{ width: "12px", height: "12px" }} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--studio-text-faint)",
                        padding: "4px",
                      }}
                    >
                      <X style={{ width: "12px", height: "12px" }} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onSelectProject(project);
                      setView("palette");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "9px 12px 9px 14px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <LayoutGrid
                      style={{
                        width: "14px",
                        height: "14px",
                        color: isActive ? "var(--studio-accent)" : "var(--studio-faint)",
                        flexShrink: 0,
                        transition: "color 0.15s",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: isActive ? "var(--studio-text)" : isHovered ? "var(--studio-text)" : "var(--studio-text-muted)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          transition: "color 0.15s",
                        }}
                      >
                        {project.name}
                      </div>
                      {project.description && (
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--studio-faint)",
                            fontFamily: "'Outfit', sans-serif",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: "1px",
                          }}
                        >
                          {project.description}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "9px",
                          color: "var(--studio-border)",
                          fontFamily: "'JetBrains Mono', monospace",
                          marginTop: "2px",
                        }}
                      >
                        {new Date(project.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <ChevronRight
                      style={{
                        width: "12px",
                        height: "12px",
                        color: isHovered || isActive ? "var(--studio-text-faint)" : "var(--studio-border)",
                        flexShrink: 0,
                        transition: "color 0.15s",
                      }}
                    />
                  </button>
                )}

                {/* Action buttons (hover) */}
                {!isEditing && (isHovered || isActive) && (
                  <div
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      display: "flex",
                      gap: "3px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(project.id);
                        setEditName(project.name);
                      }}
                      title="Rename"
                      style={{
                        background: "var(--studio-hover)",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "var(--studio-text-faint)",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "var(--studio-text-muted)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "var(--studio-text-faint)")
                      }
                    >
                      <Edit2 style={{ width: "11px", height: "11px" }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      title="Delete"
                      disabled={isDeleting}
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        color: "var(--studio-error)",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        opacity: isDeleting ? 0.5 : 1,
                      }}
                    >
                      {isDeleting ? (
                        <Loader2 style={{ width: "11px", height: "11px", animation: "spin 1s linear infinite" }} />
                      ) : (
                        <Trash2 style={{ width: "11px", height: "11px" }} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--studio-border)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => {
            setCreatingNew(true);
            setNewName("");
            setNewDesc("");
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px",
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "6px",
            color: "var(--studio-accent)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "rgba(59,130,246,0.15)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "rgba(59,130,246,0.08)")
          }
        >
          <Plus style={{ width: "14px", height: "14px" }} />
          New Project
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
