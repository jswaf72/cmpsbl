// Local-storage persistence — no Supabase required

export const supabase = null as any;

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDiagram {
  id: string;
  project_id: string;
  nodes: unknown[];
  edges: unknown[];
  created_at: string;
  updated_at: string;
}

const PROJECTS_KEY = "css_projects";
const DIAGRAM_PREFIX = "css_diagram_";

function loadProjects(): Project[] {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export async function fetchProjects(): Promise<Project[]> {
  return loadProjects().sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export async function createProject(name: string, description = ""): Promise<Project> {
  const projects = loadProjects();
  const now = new Date().toISOString();
  const project: Project = {
    id: crypto.randomUUID(),
    name,
    description,
    created_at: now,
    updated_at: now,
  };
  projects.push(project);
  saveProjects(projects);
  return project;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, "name" | "description">>
): Promise<void> {
  const projects = loadProjects().map((p) =>
    p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
  );
  saveProjects(projects);
}

export async function deleteProject(id: string): Promise<void> {
  saveProjects(loadProjects().filter((p) => p.id !== id));
  localStorage.removeItem(DIAGRAM_PREFIX + id);
}

export async function fetchDiagram(projectId: string): Promise<ProjectDiagram | null> {
  try {
    const raw = localStorage.getItem(DIAGRAM_PREFIX + projectId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveDiagram(
  projectId: string,
  nodes: unknown[],
  edges: unknown[]
): Promise<void> {
  const now = new Date().toISOString();
  const existing = await fetchDiagram(projectId);
  const diagram: ProjectDiagram = {
    id: existing?.id ?? crypto.randomUUID(),
    project_id: projectId,
    nodes,
    edges,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };
  localStorage.setItem(DIAGRAM_PREFIX + projectId, JSON.stringify(diagram));
  // bump updated_at on the project
  await updateProject(projectId, {});
}
