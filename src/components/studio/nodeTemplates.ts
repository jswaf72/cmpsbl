import { NodeTemplate } from "./types";

export const NODE_TEMPLATES: NodeTemplate[] = [
  // Transformations
  {
    id: "map",
    name: "Map",
    category: "Transformations",
    nodeType: "transform",
    description: "Applies a function to each element",
    inputs: [
      { id: "in-list", label: "List", dataType: "object", cardinality: "many", required: true },
      { id: "in-fn", label: "Function", dataType: "signal", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-list", label: "Result", dataType: "object", cardinality: "many", required: false },
    ],
  },
  {
    id: "filter",
    name: "Filter",
    category: "Transformations",
    nodeType: "transform",
    description: "Filters elements by predicate",
    inputs: [
      { id: "in-list", label: "List", dataType: "object", cardinality: "many", required: true },
      { id: "in-pred", label: "Predicate", dataType: "boolean", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-list", label: "Filtered", dataType: "object", cardinality: "many", required: false },
    ],
  },
  {
    id: "reduce",
    name: "Reduce",
    category: "Transformations",
    nodeType: "transform",
    description: "Reduces list to a single value",
    inputs: [
      { id: "in-list", label: "List", dataType: "object", cardinality: "many", required: true },
      { id: "in-init", label: "Initial", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-val", label: "Result", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "compose",
    name: "Compose",
    category: "Transformations",
    nodeType: "transform",
    description: "Composes two functions",
    inputs: [
      { id: "in-f", label: "f", dataType: "signal", cardinality: "one", required: true },
      { id: "in-g", label: "g", dataType: "signal", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-fg", label: "f∘g", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  // Inputs
  {
    id: "source",
    name: "Data Source",
    category: "Inputs",
    nodeType: "input",
    description: "Raw data entry point",
    inputs: [],
    outputs: [
      { id: "out-data", label: "Data", dataType: "object", cardinality: "many", required: false },
    ],
  },
  {
    id: "text-input",
    name: "Text Input",
    category: "Inputs",
    nodeType: "input",
    description: "String value source",
    inputs: [],
    outputs: [
      { id: "out-str", label: "Value", dataType: "string", cardinality: "one", required: false },
    ],
  },
  {
    id: "number-input",
    name: "Number Input",
    category: "Inputs",
    nodeType: "input",
    description: "Numeric value source",
    inputs: [],
    outputs: [
      { id: "out-num", label: "Value", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "event-source",
    name: "Event Source",
    category: "Inputs",
    nodeType: "input",
    description: "Emits discrete events",
    inputs: [],
    outputs: [
      { id: "out-evt", label: "Event", dataType: "event", cardinality: "many", required: false },
    ],
  },
  // Outputs
  {
    id: "sink",
    name: "Sink",
    category: "Outputs",
    nodeType: "output",
    description: "Terminal output consumer",
    inputs: [
      { id: "in-data", label: "Data", dataType: "object", cardinality: "many", required: true },
    ],
    outputs: [],
  },
  {
    id: "logger",
    name: "Logger",
    category: "Outputs",
    nodeType: "output",
    description: "Logs data to console",
    inputs: [
      { id: "in-val", label: "Value", dataType: "object", cardinality: "one", required: true },
    ],
    outputs: [],
  },
  {
    id: "renderer",
    name: "Renderer",
    category: "Outputs",
    nodeType: "output",
    description: "Renders output to UI",
    inputs: [
      { id: "in-data", label: "Data", dataType: "object", cardinality: "one", required: true },
      { id: "in-template", label: "Template", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [],
  },
  // Utilities
  {
    id: "merge",
    name: "Merge",
    category: "Utilities",
    nodeType: "utility",
    description: "Merges multiple streams",
    inputs: [
      { id: "in-a", label: "A", dataType: "object", cardinality: "one", required: true },
      { id: "in-b", label: "B", dataType: "object", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-merged", label: "Merged", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "split",
    name: "Split",
    category: "Utilities",
    nodeType: "utility",
    description: "Splits stream into branches",
    inputs: [
      { id: "in-data", label: "Input", dataType: "object", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-a", label: "Branch A", dataType: "object", cardinality: "one", required: false },
      { id: "out-b", label: "Branch B", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "delay",
    name: "Delay",
    category: "Utilities",
    nodeType: "utility",
    description: "Delays signal by duration",
    inputs: [
      { id: "in-sig", label: "Signal", dataType: "signal", cardinality: "one", required: true },
      { id: "in-dur", label: "Duration", dataType: "number", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-sig", label: "Delayed", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  // Logic
  {
    id: "condition",
    name: "Condition",
    category: "Logic",
    nodeType: "logic",
    description: "Branches on boolean condition",
    inputs: [
      { id: "in-cond", label: "Condition", dataType: "boolean", cardinality: "one", required: true },
      { id: "in-data", label: "Data", dataType: "object", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-true", label: "True", dataType: "object", cardinality: "one", required: false },
      { id: "out-false", label: "False", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "gate",
    name: "Gate",
    category: "Logic",
    nodeType: "logic",
    description: "Passes signal when gate is open",
    inputs: [
      { id: "in-sig", label: "Signal", dataType: "signal", cardinality: "one", required: true },
      { id: "in-open", label: "Open", dataType: "boolean", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-sig", label: "Output", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  // Data
  {
    id: "store",
    name: "Store",
    category: "Data",
    nodeType: "data",
    description: "Persists data values",
    inputs: [
      { id: "in-write", label: "Write", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-read", label: "Read", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "cache",
    name: "Cache",
    category: "Data",
    nodeType: "data",
    description: "Caches computation results",
    inputs: [
      { id: "in-key", label: "Key", dataType: "string", cardinality: "one", required: true },
      { id: "in-val", label: "Value", dataType: "object", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-val", label: "Cached", dataType: "object", cardinality: "one", required: false },
      { id: "out-hit", label: "Cache Hit", dataType: "boolean", cardinality: "one", required: false },
    ],
  },
  // State
  {
    id: "accumulator",
    name: "Accumulator",
    category: "State",
    nodeType: "state",
    description: "Accumulates values over time",
    inputs: [
      { id: "in-val", label: "Input", dataType: "number", cardinality: "one", required: true },
      { id: "in-reset", label: "Reset", dataType: "event", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-sum", label: "Sum", dataType: "number", cardinality: "one", required: false },
      { id: "out-count", label: "Count", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "state-machine",
    name: "State Machine",
    category: "State",
    nodeType: "state",
    description: "Finite state machine node",
    inputs: [
      { id: "in-evt", label: "Event", dataType: "event", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-state", label: "State", dataType: "string", cardinality: "one", required: false },
      { id: "out-changed", label: "Changed", dataType: "boolean", cardinality: "one", required: false },
    ],
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Transformations: "#3b82f6",
  Inputs: "#34d399",
  Outputs: "#f59e0b",
  Utilities: "#94a3b8",
  Logic: "#a78bfa",
  Data: "#22d3ee",
  State: "#fb7185",
};
