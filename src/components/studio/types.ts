export type DataType =
  | "string"
  | "number"
  | "boolean"
  | "event"
  | "ingredient"
  | "liquid"
  | "heat"
  | "signal"
  | "object";

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
  | "State";

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
