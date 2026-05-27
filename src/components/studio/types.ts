export type DataType =
  | "string"
  | "number"
  | "boolean"
  | "event"
  | "ingredient"
  | "liquid"
  | "heat"
  | "signal"
  | "object"
  // New general types
  | "stream"
  | "error"
  | "entity"
  | "timestamp"
  | "token"
  | "array"
  | "fn"
  | "bytes"
  | "resource"
  // Music types
  | "note"
  | "chord"
  | "rhythm"
  | "audio"
  | "midi"
  | "frequency"
  | "tempo"
  | "pattern";

export const DATA_TYPE_COLORS: Record<DataType, string> = {
  string: "#60a5fa",
  number: "#f59e0b",
  boolean: "#a78bfa",
  event: "#c084fc",
  ingredient: "#34d399",
  liquid: "#22d3ee",
  heat: "#f97316",
  signal: "#fb7185",
  object: "#94a3b8",
  // New general types
  stream: "#06b6d4",
  error: "#f43f5e",
  entity: "#818cf8",
  timestamp: "#e879f9",
  token: "#fbbf24",
  array: "#38bdf8",
  fn: "#a3e635",
  bytes: "#84cc16",
  resource: "#fb923c",
  // Music types
  note: "#f472b6",
  chord: "#c084fc",
  rhythm: "#facc15",
  audio: "#4ade80",
  midi: "#67e8f9",
  frequency: "#fb7185",
  tempo: "#fcd34d",
  pattern: "#a78bfa",
};

export const DATA_TYPE_LABELS: Record<DataType, string> = {
  string: "String",
  number: "Number",
  boolean: "Boolean",
  event: "Event",
  ingredient: "Ingredient",
  liquid: "Liquid",
  heat: "Heat",
  signal: "Signal",
  object: "Object",
  // New general types
  stream: "Stream",
  error: "Error",
  entity: "Entity",
  timestamp: "Timestamp",
  token: "Token",
  array: "Array",
  fn: "Function",
  bytes: "Bytes",
  resource: "Resource",
  // Music types
  note: "Note",
  chord: "Chord",
  rhythm: "Rhythm",
  audio: "Audio",
  midi: "MIDI",
  frequency: "Frequency",
  tempo: "Tempo",
  pattern: "Pattern",
};

export interface PortDef {
  id: string;
  label: string;
  dataType: DataType;
  cardinality: "one" | "many";
  required: boolean;
}

export interface NodeTemplate {
  id: string;
  name: string;
  category: NodeCategory;
  nodeType: string;
  description: string;
  inputs: PortDef[];
  outputs: PortDef[];
  color?: string;
}

export type NodeCategory =
  | "Transformations"
  | "Inputs"
  | "Outputs"
  | "Utilities"
  | "Logic"
  | "Data"
  | "State"
  | "Network / IO"
  | "Process"
  | "Infrastructure"
  | "AI / ML"
  | "Music"
  | "Aggregations"
  | "Monitoring"
  | "UI Templates / Atoms"
  | "UI Templates / Molecules"
  | "UI Templates / Organisms"
  | "UI Templates / Templates"
  | "UI Templates / Pages"
  | "UI Templates / Design Tokens";

export interface StudioNodeData extends Record<string, unknown> {
  label: string;
  description: string;
  nodeType: string;
  category: NodeCategory;
  inputs: PortDef[];
  outputs: PortDef[];
  metadata: Record<string, string>;
  color?: string;
}

export interface MetadataEntry {
  key: string;
  value: string;
}
