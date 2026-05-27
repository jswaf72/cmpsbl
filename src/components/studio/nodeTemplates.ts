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

  // ─── Network / IO ──────────────────────────────────────────────
  {
    id: "http-request",
    name: "HTTP Request",
    category: "Network / IO",
    nodeType: "io",
    description: "Makes an HTTP request to a URL",
    inputs: [
      { id: "in-url", label: "URL", dataType: "string", cardinality: "one", required: true },
      { id: "in-method", label: "Method", dataType: "string", cardinality: "one", required: true },
      { id: "in-body", label: "Body", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-response", label: "Response", dataType: "object", cardinality: "one", required: false },
      { id: "out-status", label: "Status", dataType: "number", cardinality: "one", required: false },
      { id: "out-error", label: "Error", dataType: "error", cardinality: "one", required: false },
    ],
  },
  {
    id: "webhook-listener",
    name: "Webhook Listener",
    category: "Network / IO",
    nodeType: "io",
    description: "Receives incoming webhook payloads",
    inputs: [],
    outputs: [
      { id: "out-payload", label: "Payload", dataType: "object", cardinality: "one", required: false },
      { id: "out-ts", label: "Timestamp", dataType: "timestamp", cardinality: "one", required: false },
    ],
  },
  {
    id: "queue-producer",
    name: "Queue Producer",
    category: "Network / IO",
    nodeType: "io",
    description: "Publishes messages to a queue",
    inputs: [
      { id: "in-message", label: "Message", dataType: "object", cardinality: "one", required: true },
      { id: "in-topic", label: "Topic", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-ack", label: "Ack", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "queue-consumer",
    name: "Queue Consumer",
    category: "Network / IO",
    nodeType: "io",
    description: "Consumes messages from a queue",
    inputs: [
      { id: "in-topic", label: "Topic", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-message", label: "Message", dataType: "object", cardinality: "one", required: false },
      { id: "out-offset", label: "Offset", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "database-query",
    name: "Database Query",
    category: "Network / IO",
    nodeType: "io",
    description: "Executes a SQL / NoSQL query",
    inputs: [
      { id: "in-query", label: "Query", dataType: "string", cardinality: "one", required: true },
      { id: "in-params", label: "Params", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-rows", label: "Rows", dataType: "object", cardinality: "many", required: false },
      { id: "out-count", label: "Count", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "stream-source",
    name: "Stream Source",
    category: "Network / IO",
    nodeType: "io",
    description: "WebSocket / SSE continuous stream",
    inputs: [
      { id: "in-url", label: "URL", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-stream", label: "Stream", dataType: "stream", cardinality: "one", required: false },
    ],
  },

  // ─── Process ───────────────────────────────────────────────────
  {
    id: "start-event",
    name: "Start Event",
    category: "Process",
    nodeType: "process",
    description: "Entry point of a process or workflow",
    inputs: [],
    outputs: [
      { id: "out-trigger", label: "Trigger", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "end-event",
    name: "End Event",
    category: "Process",
    nodeType: "process",
    description: "Terminal node of a workflow",
    inputs: [
      { id: "in-result", label: "Result", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [],
  },
  {
    id: "user-task",
    name: "User Task",
    category: "Process",
    nodeType: "process",
    description: "Human-in-the-loop step",
    inputs: [
      { id: "in-assignee", label: "Assignee", dataType: "string", cardinality: "one", required: true },
      { id: "in-payload", label: "Payload", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-decision", label: "Decision", dataType: "string", cardinality: "one", required: false },
      { id: "out-output", label: "Output", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "timer",
    name: "Timer",
    category: "Process",
    nodeType: "process",
    description: "Scheduled or periodic trigger",
    inputs: [
      { id: "in-duration", label: "Duration", dataType: "number", cardinality: "one", required: true },
      { id: "in-repeat", label: "Repeat", dataType: "boolean", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-tick", label: "Tick", dataType: "event", cardinality: "one", required: false },
      { id: "out-elapsed", label: "Elapsed", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "parallel-gateway",
    name: "Parallel Gateway",
    category: "Process",
    nodeType: "process",
    description: "Forks a trigger into concurrent branches",
    inputs: [
      { id: "in-trigger", label: "Trigger", dataType: "event", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-a", label: "Branch A", dataType: "event", cardinality: "one", required: false },
      { id: "out-b", label: "Branch B", dataType: "event", cardinality: "one", required: false },
      { id: "out-c", label: "Branch C", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "join-gateway",
    name: "Join Gateway",
    category: "Process",
    nodeType: "process",
    description: "Synchronizes parallel branches",
    inputs: [
      { id: "in-a", label: "Branch A", dataType: "event", cardinality: "one", required: true },
      { id: "in-b", label: "Branch B", dataType: "event", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-merged", label: "Merged", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "sub-process",
    name: "Sub-Process",
    category: "Process",
    nodeType: "process",
    description: "Encapsulated sub-workflow",
    inputs: [
      { id: "in-input", label: "Input", dataType: "object", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-output", label: "Output", dataType: "object", cardinality: "one", required: false },
      { id: "out-error", label: "Error", dataType: "error", cardinality: "one", required: false },
    ],
  },

  // ─── Infrastructure ────────────────────────────────────────────
  {
    id: "service",
    name: "Service",
    category: "Infrastructure",
    nodeType: "infra",
    description: "Represents a microservice",
    inputs: [
      { id: "in-request", label: "Request", dataType: "object", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-response", label: "Response", dataType: "object", cardinality: "one", required: false },
      { id: "out-latency", label: "Latency", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "load-balancer",
    name: "Load Balancer",
    category: "Infrastructure",
    nodeType: "infra",
    description: "Distributes traffic across services",
    inputs: [
      { id: "in-requests", label: "Requests", dataType: "object", cardinality: "many", required: true },
    ],
    outputs: [
      { id: "out-routed", label: "Routed", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "rate-limiter",
    name: "Rate Limiter",
    category: "Infrastructure",
    nodeType: "infra",
    description: "Throttle control for incoming signals",
    inputs: [
      { id: "in-signal", label: "Signal", dataType: "signal", cardinality: "one", required: true },
      { id: "in-limit", label: "Limit", dataType: "number", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-allowed", label: "Allowed", dataType: "signal", cardinality: "one", required: false },
      { id: "out-throttled", label: "Throttled", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "circuit-breaker",
    name: "Circuit Breaker",
    category: "Infrastructure",
    nodeType: "infra",
    description: "Fault tolerance gate",
    inputs: [
      { id: "in-signal", label: "Signal", dataType: "signal", cardinality: "one", required: true },
      { id: "in-failures", label: "Failure Count", dataType: "number", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-open", label: "Open", dataType: "boolean", cardinality: "one", required: false },
      { id: "out-output", label: "Output", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "secret",
    name: "Secret",
    category: "Infrastructure",
    nodeType: "infra",
    description: "Provides a credential or API key",
    inputs: [],
    outputs: [
      { id: "out-value", label: "Value", dataType: "token", cardinality: "one", required: false },
    ],
  },
  {
    id: "storage-bucket",
    name: "Storage Bucket",
    category: "Infrastructure",
    nodeType: "infra",
    description: "Object storage read/write",
    inputs: [
      { id: "in-key", label: "Key", dataType: "string", cardinality: "one", required: true },
      { id: "in-value", label: "Value", dataType: "bytes", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-stored", label: "Stored", dataType: "boolean", cardinality: "one", required: false },
      { id: "out-url", label: "URL", dataType: "string", cardinality: "one", required: false },
    ],
  },

  // ─── AI / ML ───────────────────────────────────────────────────
  {
    id: "llm-prompt",
    name: "LLM Prompt",
    category: "AI / ML",
    nodeType: "ai",
    description: "Calls a language model with a prompt",
    inputs: [
      { id: "in-prompt", label: "Prompt", dataType: "string", cardinality: "one", required: true },
      { id: "in-context", label: "Context", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-response", label: "Response", dataType: "string", cardinality: "one", required: false },
      { id: "out-tokens", label: "Tokens Used", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "embedder",
    name: "Embedder",
    category: "AI / ML",
    nodeType: "ai",
    description: "Generates vector embeddings from text",
    inputs: [
      { id: "in-text", label: "Text", dataType: "string", cardinality: "many", required: true },
    ],
    outputs: [
      { id: "out-embeddings", label: "Embeddings", dataType: "object", cardinality: "many", required: false },
    ],
  },
  {
    id: "vector-search",
    name: "Vector Search",
    category: "AI / ML",
    nodeType: "ai",
    description: "Similarity search over vector store",
    inputs: [
      { id: "in-query", label: "Query", dataType: "object", cardinality: "one", required: true },
      { id: "in-k", label: "Top K", dataType: "number", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-results", label: "Results", dataType: "object", cardinality: "many", required: false },
      { id: "out-scores", label: "Scores", dataType: "number", cardinality: "many", required: false },
    ],
  },
  {
    id: "classifier",
    name: "Classifier",
    category: "AI / ML",
    nodeType: "ai",
    description: "Classifies input into labeled categories",
    inputs: [
      { id: "in-input", label: "Input", dataType: "object", cardinality: "one", required: true },
      { id: "in-labels", label: "Labels", dataType: "string", cardinality: "many", required: true },
    ],
    outputs: [
      { id: "out-label", label: "Label", dataType: "string", cardinality: "one", required: false },
      { id: "out-confidence", label: "Confidence", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "rag-pipeline",
    name: "RAG Pipeline",
    category: "AI / ML",
    nodeType: "ai",
    description: "Retrieval-augmented generation",
    inputs: [
      { id: "in-query", label: "Query", dataType: "string", cardinality: "one", required: true },
      { id: "in-docs", label: "Documents", dataType: "object", cardinality: "many", required: true },
    ],
    outputs: [
      { id: "out-answer", label: "Answer", dataType: "string", cardinality: "one", required: false },
      { id: "out-sources", label: "Sources", dataType: "object", cardinality: "many", required: false },
    ],
  },

  // ─── Aggregations ──────────────────────────────────────────────
  {
    id: "sort",
    name: "Sort",
    category: "Aggregations",
    nodeType: "transform",
    description: "Sorts a list by a key",
    inputs: [
      { id: "in-list", label: "List", dataType: "object", cardinality: "many", required: true },
      { id: "in-key", label: "Key", dataType: "string", cardinality: "one", required: true },
      { id: "in-dir", label: "Direction", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-sorted", label: "Sorted", dataType: "object", cardinality: "many", required: false },
    ],
  },
  {
    id: "group-by",
    name: "Group By",
    category: "Aggregations",
    nodeType: "transform",
    description: "Groups list items by a key",
    inputs: [
      { id: "in-list", label: "List", dataType: "object", cardinality: "many", required: true },
      { id: "in-key", label: "Key", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-groups", label: "Groups", dataType: "object", cardinality: "many", required: false },
    ],
  },
  {
    id: "join-tables",
    name: "Join",
    category: "Aggregations",
    nodeType: "transform",
    description: "Relational join of two lists",
    inputs: [
      { id: "in-left", label: "Left", dataType: "object", cardinality: "many", required: true },
      { id: "in-right", label: "Right", dataType: "object", cardinality: "many", required: true },
      { id: "in-on", label: "On Key", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-joined", label: "Joined", dataType: "object", cardinality: "many", required: false },
    ],
  },
  {
    id: "statistics",
    name: "Statistics",
    category: "Aggregations",
    nodeType: "transform",
    description: "Descriptive statistics over a number list",
    inputs: [
      { id: "in-values", label: "Values", dataType: "number", cardinality: "many", required: true },
    ],
    outputs: [
      { id: "out-mean", label: "Mean", dataType: "number", cardinality: "one", required: false },
      { id: "out-median", label: "Median", dataType: "number", cardinality: "one", required: false },
      { id: "out-std", label: "Std Dev", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "math-op",
    name: "Math Op",
    category: "Aggregations",
    nodeType: "transform",
    description: "Arithmetic operation on two numbers",
    inputs: [
      { id: "in-a", label: "A", dataType: "number", cardinality: "one", required: true },
      { id: "in-b", label: "B", dataType: "number", cardinality: "one", required: true },
      { id: "in-op", label: "Op (+−×÷)", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-result", label: "Result", dataType: "number", cardinality: "one", required: false },
    ],
  },

  // ─── Monitoring ────────────────────────────────────────────────
  {
    id: "metric-emitter",
    name: "Metric Emitter",
    category: "Monitoring",
    nodeType: "observe",
    description: "Emits a named metric signal",
    inputs: [
      { id: "in-name", label: "Name", dataType: "string", cardinality: "one", required: true },
      { id: "in-value", label: "Value", dataType: "number", cardinality: "one", required: true },
      { id: "in-tags", label: "Tags", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-metric", label: "Metric", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "alert",
    name: "Alert",
    category: "Monitoring",
    nodeType: "observe",
    description: "Fires an alert when condition is met",
    inputs: [
      { id: "in-condition", label: "Condition", dataType: "boolean", cardinality: "one", required: true },
      { id: "in-message", label: "Message", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-fired", label: "Fired", dataType: "event", cardinality: "one", required: false },
      { id: "out-severity", label: "Severity", dataType: "string", cardinality: "one", required: false },
    ],
  },
  {
    id: "health-check",
    name: "Health Check",
    category: "Monitoring",
    nodeType: "observe",
    description: "Liveness / readiness probe",
    inputs: [],
    outputs: [
      { id: "out-healthy", label: "Healthy", dataType: "boolean", cardinality: "one", required: false },
      { id: "out-latency", label: "Latency", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "tap",
    name: "Tap",
    category: "Monitoring",
    nodeType: "observe",
    description: "Passthrough debug observer",
    inputs: [
      { id: "in-signal", label: "Signal", dataType: "signal", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-signal", label: "Signal", dataType: "signal", cardinality: "one", required: false },
      { id: "out-snapshot", label: "Snapshot", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "trace-span",
    name: "Trace Span",
    category: "Monitoring",
    nodeType: "observe",
    description: "Distributed tracing span",
    inputs: [
      { id: "in-operation", label: "Operation", dataType: "string", cardinality: "one", required: true },
      { id: "in-parent", label: "Parent Span", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-span", label: "Span", dataType: "object", cardinality: "one", required: false },
      { id: "out-duration", label: "Duration", dataType: "number", cardinality: "one", required: false },
    ],
  },

  // ─── Music ─────────────────────────────────────────────────────
  {
    id: "note-source",
    name: "Note Source",
    category: "Music",
    nodeType: "music",
    description: "Emits a musical note with pitch and duration",
    inputs: [],
    outputs: [
      { id: "out-note", label: "Note", dataType: "note", cardinality: "one", required: false },
      { id: "out-freq", label: "Frequency", dataType: "frequency", cardinality: "one", required: false },
    ],
  },
  {
    id: "chord-builder",
    name: "Chord Builder",
    category: "Music",
    nodeType: "music",
    description: "Builds a chord from individual notes",
    inputs: [
      { id: "in-root", label: "Root", dataType: "note", cardinality: "one", required: true },
      { id: "in-quality", label: "Quality", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-chord", label: "Chord", dataType: "chord", cardinality: "one", required: false },
      { id: "out-notes", label: "Notes", dataType: "note", cardinality: "many", required: false },
    ],
  },
  {
    id: "sequencer",
    name: "Sequencer",
    category: "Music",
    nodeType: "music",
    description: "Steps through a note pattern in time",
    inputs: [
      { id: "in-pattern", label: "Pattern", dataType: "pattern", cardinality: "one", required: true },
      { id: "in-tempo", label: "Tempo", dataType: "tempo", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-note", label: "Note", dataType: "note", cardinality: "one", required: false },
      { id: "out-tick", label: "Tick", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "rhythm-generator",
    name: "Rhythm Generator",
    category: "Music",
    nodeType: "music",
    description: "Produces rhythmic trigger patterns",
    inputs: [
      { id: "in-tempo", label: "Tempo (BPM)", dataType: "tempo", cardinality: "one", required: true },
      { id: "in-meter", label: "Meter", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-rhythm", label: "Rhythm", dataType: "rhythm", cardinality: "one", required: false },
      { id: "out-beat", label: "Beat", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "synthesizer",
    name: "Synthesizer",
    category: "Music",
    nodeType: "music",
    description: "Converts notes/frequency to audio signal",
    inputs: [
      { id: "in-note", label: "Note", dataType: "note", cardinality: "one", required: false },
      { id: "in-freq", label: "Frequency", dataType: "frequency", cardinality: "one", required: false },
      { id: "in-waveform", label: "Waveform", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-audio", label: "Audio", dataType: "audio", cardinality: "one", required: false },
    ],
  },
  {
    id: "midi-input",
    name: "MIDI Input",
    category: "Music",
    nodeType: "music",
    description: "Receives MIDI messages from a device or file",
    inputs: [],
    outputs: [
      { id: "out-midi", label: "MIDI", dataType: "midi", cardinality: "one", required: false },
      { id: "out-note", label: "Note On", dataType: "note", cardinality: "one", required: false },
      { id: "out-velocity", label: "Velocity", dataType: "number", cardinality: "one", required: false },
    ],
  },
  {
    id: "midi-output",
    name: "MIDI Output",
    category: "Music",
    nodeType: "music",
    description: "Sends MIDI to a device or virtual port",
    inputs: [
      { id: "in-midi", label: "MIDI", dataType: "midi", cardinality: "one", required: true },
    ],
    outputs: [],
  },
  {
    id: "audio-mixer",
    name: "Audio Mixer",
    category: "Music",
    nodeType: "music",
    description: "Mixes multiple audio streams with volume/pan",
    inputs: [
      { id: "in-a", label: "Track A", dataType: "audio", cardinality: "one", required: true },
      { id: "in-b", label: "Track B", dataType: "audio", cardinality: "one", required: false },
      { id: "in-gain", label: "Gain", dataType: "number", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-mix", label: "Mix", dataType: "audio", cardinality: "one", required: false },
    ],
  },
  {
    id: "audio-effect",
    name: "Audio Effect",
    category: "Music",
    nodeType: "music",
    description: "Applies an effect (reverb, delay, EQ) to audio",
    inputs: [
      { id: "in-audio", label: "Audio In", dataType: "audio", cardinality: "one", required: true },
      { id: "in-type", label: "Effect Type", dataType: "string", cardinality: "one", required: true },
      { id: "in-params", label: "Params", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-audio", label: "Audio Out", dataType: "audio", cardinality: "one", required: false },
    ],
  },
  {
    id: "scale-filter",
    name: "Scale Filter",
    category: "Music",
    nodeType: "music",
    description: "Constrains notes to a musical scale",
    inputs: [
      { id: "in-note", label: "Note", dataType: "note", cardinality: "one", required: true },
      { id: "in-root", label: "Root", dataType: "string", cardinality: "one", required: true },
      { id: "in-scale", label: "Scale", dataType: "string", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-note", label: "Quantized Note", dataType: "note", cardinality: "one", required: false },
      { id: "out-in-scale", label: "In Scale", dataType: "boolean", cardinality: "one", required: false },
    ],
  },
  {
    id: "arpeggiator",
    name: "Arpeggiator",
    category: "Music",
    nodeType: "music",
    description: "Generates arpeggiated notes from a chord",
    inputs: [
      { id: "in-chord", label: "Chord", dataType: "chord", cardinality: "one", required: true },
      { id: "in-pattern", label: "Pattern", dataType: "pattern", cardinality: "one", required: false },
      { id: "in-tempo", label: "Tempo", dataType: "tempo", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-note", label: "Note", dataType: "note", cardinality: "one", required: false },
    ],
  },
  {
    id: "transpose",
    name: "Transpose",
    category: "Music",
    nodeType: "music",
    description: "Shifts notes by semitones or octaves",
    inputs: [
      { id: "in-note", label: "Note", dataType: "note", cardinality: "one", required: true },
      { id: "in-semitones", label: "Semitones", dataType: "number", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-note", label: "Transposed", dataType: "note", cardinality: "one", required: false },
    ],
  },
  {
    id: "tempo-source",
    name: "Tempo Source",
    category: "Music",
    nodeType: "music",
    description: "Master BPM clock source",
    inputs: [],
    outputs: [
      { id: "out-tempo", label: "Tempo (BPM)", dataType: "tempo", cardinality: "one", required: false },
      { id: "out-clock", label: "Clock", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "audio-output",
    name: "Audio Output",
    category: "Music",
    nodeType: "music",
    description: "Final audio sink — speakers or file",
    inputs: [
      { id: "in-audio", label: "Audio", dataType: "audio", cardinality: "one", required: true },
    ],
    outputs: [],
  },

  // ─── UI Templates — Atoms ──────────────────────────────────────
  {
    id: "ui-button",
    name: "Button",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "Interactive clickable element",
    inputs: [
      { id: "in-label", label: "Label", dataType: "string", cardinality: "one", required: true },
      { id: "in-variant", label: "Variant", dataType: "string", cardinality: "one", required: false },
      { id: "in-disabled", label: "Disabled", dataType: "boolean", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-click", label: "onClick", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-text",
    name: "Text",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "Typographic text element",
    inputs: [
      { id: "in-content", label: "Content", dataType: "string", cardinality: "one", required: true },
      { id: "in-variant", label: "Variant", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-rendered", label: "Rendered", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-icon",
    name: "Icon",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "SVG icon element",
    inputs: [
      { id: "in-name", label: "Icon Name", dataType: "string", cardinality: "one", required: true },
      { id: "in-size", label: "Size", dataType: "number", cardinality: "one", required: false },
      { id: "in-color", label: "Color", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-rendered", label: "Rendered", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-input",
    name: "Input Field",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "Text input control",
    inputs: [
      { id: "in-placeholder", label: "Placeholder", dataType: "string", cardinality: "one", required: false },
      { id: "in-value", label: "Value", dataType: "string", cardinality: "one", required: false },
      { id: "in-type", label: "Type", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-value", label: "Value", dataType: "string", cardinality: "one", required: false },
      { id: "out-change", label: "onChange", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-image",
    name: "Image",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "Image display element",
    inputs: [
      { id: "in-src", label: "Src", dataType: "string", cardinality: "one", required: true },
      { id: "in-alt", label: "Alt", dataType: "string", cardinality: "one", required: false },
      { id: "in-width", label: "Width", dataType: "number", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-load", label: "onLoad", dataType: "event", cardinality: "one", required: false },
      { id: "out-error", label: "onError", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-badge",
    name: "Badge",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "Small status or label indicator",
    inputs: [
      { id: "in-label", label: "Label", dataType: "string", cardinality: "one", required: true },
      { id: "in-color", label: "Color", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-rendered", label: "Rendered", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-spinner",
    name: "Spinner",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "Loading indicator",
    inputs: [
      { id: "in-loading", label: "Loading", dataType: "boolean", cardinality: "one", required: true },
      { id: "in-size", label: "Size", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-rendered", label: "Rendered", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-divider",
    name: "Divider",
    category: "UI Templates / Atoms",
    nodeType: "ui-atom",
    description: "Horizontal or vertical separator line",
    inputs: [
      { id: "in-orientation", label: "Orientation", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-rendered", label: "Rendered", dataType: "signal", cardinality: "one", required: false },
    ],
  },

  // ─── UI Templates — Molecules ──────────────────────────────────
  {
    id: "ui-search-bar",
    name: "Search Bar",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Input + icon + clear button composite",
    inputs: [
      { id: "in-placeholder", label: "Placeholder", dataType: "string", cardinality: "one", required: false },
      { id: "in-value", label: "Query", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-query", label: "Query", dataType: "string", cardinality: "one", required: false },
      { id: "out-submit", label: "onSubmit", dataType: "event", cardinality: "one", required: false },
      { id: "out-clear", label: "onClear", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-form-field",
    name: "Form Field",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Label + input + validation message",
    inputs: [
      { id: "in-label", label: "Label", dataType: "string", cardinality: "one", required: true },
      { id: "in-value", label: "Value", dataType: "string", cardinality: "one", required: false },
      { id: "in-error", label: "Error", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-value", label: "Value", dataType: "string", cardinality: "one", required: false },
      { id: "out-valid", label: "Valid", dataType: "boolean", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-card",
    name: "Card",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Contained surface with header, body, footer slots",
    inputs: [
      { id: "in-title", label: "Title", dataType: "string", cardinality: "one", required: false },
      { id: "in-content", label: "Content", dataType: "object", cardinality: "one", required: false },
      { id: "in-actions", label: "Actions", dataType: "object", cardinality: "many", required: false },
    ],
    outputs: [
      { id: "out-action", label: "onAction", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-tooltip",
    name: "Tooltip",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Hover-triggered contextual hint",
    inputs: [
      { id: "in-content", label: "Content", dataType: "string", cardinality: "one", required: true },
      { id: "in-trigger", label: "Trigger", dataType: "signal", cardinality: "one", required: true },
      { id: "in-placement", label: "Placement", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-visible", label: "Visible", dataType: "boolean", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-dropdown",
    name: "Dropdown Menu",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Trigger + floating option list",
    inputs: [
      { id: "in-items", label: "Items", dataType: "object", cardinality: "many", required: true },
      { id: "in-selected", label: "Selected", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-selected", label: "Selected", dataType: "string", cardinality: "one", required: false },
      { id: "out-change", label: "onChange", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-tabs",
    name: "Tab Bar",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Horizontal tab navigation strip",
    inputs: [
      { id: "in-tabs", label: "Tabs", dataType: "object", cardinality: "many", required: true },
      { id: "in-active", label: "Active Tab", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-active", label: "Active", dataType: "string", cardinality: "one", required: false },
      { id: "out-change", label: "onChange", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-modal",
    name: "Modal",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Overlay dialog with backdrop",
    inputs: [
      { id: "in-open", label: "Open", dataType: "boolean", cardinality: "one", required: true },
      { id: "in-title", label: "Title", dataType: "string", cardinality: "one", required: false },
      { id: "in-content", label: "Content", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-close", label: "onClose", dataType: "event", cardinality: "one", required: false },
      { id: "out-confirm", label: "onConfirm", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-notification",
    name: "Notification",
    category: "UI Templates / Molecules",
    nodeType: "ui-molecule",
    description: "Toast or banner alert message",
    inputs: [
      { id: "in-message", label: "Message", dataType: "string", cardinality: "one", required: true },
      { id: "in-type", label: "Type", dataType: "string", cardinality: "one", required: false },
      { id: "in-trigger", label: "Trigger", dataType: "event", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-dismissed", label: "onDismiss", dataType: "event", cardinality: "one", required: false },
    ],
  },

  // ─── UI Templates — Organisms ──────────────────────────────────
  {
    id: "ui-navbar",
    name: "Navigation Bar",
    category: "UI Templates / Organisms",
    nodeType: "ui-organism",
    description: "Top-level site header with nav links and actions",
    inputs: [
      { id: "in-brand", label: "Brand", dataType: "object", cardinality: "one", required: false },
      { id: "in-links", label: "Nav Links", dataType: "object", cardinality: "many", required: false },
      { id: "in-actions", label: "Actions", dataType: "object", cardinality: "many", required: false },
      { id: "in-user", label: "User", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-navigate", label: "onNavigate", dataType: "event", cardinality: "one", required: false },
      { id: "out-action", label: "onAction", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-data-table",
    name: "Data Table",
    category: "UI Templates / Organisms",
    nodeType: "ui-organism",
    description: "Paginated, sortable, filterable data grid",
    inputs: [
      { id: "in-rows", label: "Rows", dataType: "object", cardinality: "many", required: true },
      { id: "in-columns", label: "Columns", dataType: "object", cardinality: "many", required: true },
      { id: "in-page", label: "Page", dataType: "number", cardinality: "one", required: false },
      { id: "in-filters", label: "Filters", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-selected", label: "Selected Rows", dataType: "object", cardinality: "many", required: false },
      { id: "out-sort", label: "Sort Change", dataType: "event", cardinality: "one", required: false },
      { id: "out-page", label: "Page Change", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-form",
    name: "Form",
    category: "UI Templates / Organisms",
    nodeType: "ui-organism",
    description: "Multi-field form with validation and submission",
    inputs: [
      { id: "in-schema", label: "Schema", dataType: "object", cardinality: "one", required: true },
      { id: "in-defaults", label: "Default Values", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-values", label: "Form Values", dataType: "object", cardinality: "one", required: false },
      { id: "out-submit", label: "onSubmit", dataType: "event", cardinality: "one", required: false },
      { id: "out-valid", label: "Valid", dataType: "boolean", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-sidebar",
    name: "Sidebar",
    category: "UI Templates / Organisms",
    nodeType: "ui-organism",
    description: "Collapsible side navigation panel",
    inputs: [
      { id: "in-items", label: "Nav Items", dataType: "object", cardinality: "many", required: true },
      { id: "in-collapsed", label: "Collapsed", dataType: "boolean", cardinality: "one", required: false },
      { id: "in-active", label: "Active Route", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-navigate", label: "onNavigate", dataType: "event", cardinality: "one", required: false },
      { id: "out-toggle", label: "onToggle", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-hero",
    name: "Hero Section",
    category: "UI Templates / Organisms",
    nodeType: "ui-organism",
    description: "Full-width landing section with headline, CTA",
    inputs: [
      { id: "in-headline", label: "Headline", dataType: "string", cardinality: "one", required: true },
      { id: "in-subheadline", label: "Sub-headline", dataType: "string", cardinality: "one", required: false },
      { id: "in-cta", label: "CTA Label", dataType: "string", cardinality: "one", required: false },
      { id: "in-bg", label: "Background", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-cta", label: "onCTA", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-profile-card",
    name: "Profile Card",
    category: "UI Templates / Organisms",
    nodeType: "ui-organism",
    description: "User avatar, name, role, and action buttons",
    inputs: [
      { id: "in-user", label: "User", dataType: "object", cardinality: "one", required: true },
      { id: "in-actions", label: "Actions", dataType: "object", cardinality: "many", required: false },
    ],
    outputs: [
      { id: "out-action", label: "onAction", dataType: "event", cardinality: "one", required: false },
    ],
  },

  // ─── UI Templates — Templates (Page-level) ─────────────────────
  {
    id: "ui-dashboard-layout",
    name: "Dashboard Layout",
    category: "UI Templates / Templates",
    nodeType: "ui-template",
    description: "Sidebar + topbar + main content area skeleton",
    inputs: [
      { id: "in-sidebar", label: "Sidebar", dataType: "signal", cardinality: "one", required: false },
      { id: "in-navbar", label: "Navbar", dataType: "signal", cardinality: "one", required: false },
      { id: "in-content", label: "Content", dataType: "signal", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-layout", label: "Layout", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-auth-layout",
    name: "Auth Layout",
    category: "UI Templates / Templates",
    nodeType: "ui-template",
    description: "Centered card layout for login / signup flows",
    inputs: [
      { id: "in-form", label: "Form", dataType: "signal", cardinality: "one", required: false },
      { id: "in-brand", label: "Brand", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-layout", label: "Layout", dataType: "signal", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-settings-layout",
    name: "Settings Layout",
    category: "UI Templates / Templates",
    nodeType: "ui-template",
    description: "Tabbed or sectioned settings page skeleton",
    inputs: [
      { id: "in-sections", label: "Sections", dataType: "object", cardinality: "many", required: true },
      { id: "in-active", label: "Active Section", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-active", label: "Active", dataType: "string", cardinality: "one", required: false },
      { id: "out-save", label: "onSave", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-list-detail-layout",
    name: "List-Detail Layout",
    category: "UI Templates / Templates",
    nodeType: "ui-template",
    description: "Master list + detail panel two-column layout",
    inputs: [
      { id: "in-items", label: "Items", dataType: "object", cardinality: "many", required: true },
      { id: "in-selected", label: "Selected", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-selected", label: "onSelect", dataType: "event", cardinality: "one", required: false },
    ],
  },

  // ─── UI Templates — Pages ──────────────────────────────────────
  {
    id: "ui-landing-page",
    name: "Landing Page",
    category: "UI Templates / Pages",
    nodeType: "ui-page",
    description: "Full marketing landing page composition",
    inputs: [
      { id: "in-content", label: "Content Data", dataType: "object", cardinality: "one", required: false },
      { id: "in-theme", label: "Theme", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-cta", label: "onCTA", dataType: "event", cardinality: "one", required: false },
      { id: "out-navigate", label: "onNavigate", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-dashboard-page",
    name: "Dashboard Page",
    category: "UI Templates / Pages",
    nodeType: "ui-page",
    description: "Analytics dashboard with charts, stats, and tables",
    inputs: [
      { id: "in-metrics", label: "Metrics", dataType: "object", cardinality: "many", required: false },
      { id: "in-user", label: "User", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-action", label: "onAction", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-crud-page",
    name: "CRUD Page",
    category: "UI Templates / Pages",
    nodeType: "ui-page",
    description: "List + create/edit/delete full resource management page",
    inputs: [
      { id: "in-resource", label: "Resource", dataType: "string", cardinality: "one", required: true },
      { id: "in-items", label: "Items", dataType: "object", cardinality: "many", required: false },
      { id: "in-schema", label: "Schema", dataType: "object", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-create", label: "onCreate", dataType: "event", cardinality: "one", required: false },
      { id: "out-update", label: "onUpdate", dataType: "event", cardinality: "one", required: false },
      { id: "out-delete", label: "onDelete", dataType: "event", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-profile-page",
    name: "Profile Page",
    category: "UI Templates / Pages",
    nodeType: "ui-page",
    description: "User profile with avatar, bio, activity feed",
    inputs: [
      { id: "in-user", label: "User", dataType: "object", cardinality: "one", required: true },
      { id: "in-editable", label: "Editable", dataType: "boolean", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-save", label: "onSave", dataType: "event", cardinality: "one", required: false },
    ],
  },

  // ─── UI Templates — Design Tokens ─────────────────────────────
  {
    id: "ui-color-token",
    name: "Color Token",
    category: "UI Templates / Design Tokens",
    nodeType: "ui-token",
    description: "Named color value from the design system",
    inputs: [],
    outputs: [
      { id: "out-hex", label: "Hex", dataType: "string", cardinality: "one", required: false },
      { id: "out-rgb", label: "RGB", dataType: "object", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-typography-token",
    name: "Typography Token",
    category: "UI Templates / Design Tokens",
    nodeType: "ui-token",
    description: "Font family, size, weight, and line-height bundle",
    inputs: [],
    outputs: [
      { id: "out-style", label: "Style Object", dataType: "object", cardinality: "one", required: false },
      { id: "out-class", label: "CSS Class", dataType: "string", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-spacing-token",
    name: "Spacing Token",
    category: "UI Templates / Design Tokens",
    nodeType: "ui-token",
    description: "Spacing scale value (margin, padding, gap)",
    inputs: [
      { id: "in-scale", label: "Scale Step", dataType: "number", cardinality: "one", required: true },
    ],
    outputs: [
      { id: "out-px", label: "Pixels", dataType: "number", cardinality: "one", required: false },
      { id: "out-rem", label: "Rem", dataType: "string", cardinality: "one", required: false },
    ],
  },
  {
    id: "ui-theme",
    name: "Theme",
    category: "UI Templates / Design Tokens",
    nodeType: "ui-token",
    description: "Full design token bundle for a color mode or brand",
    inputs: [
      { id: "in-mode", label: "Mode", dataType: "string", cardinality: "one", required: false },
    ],
    outputs: [
      { id: "out-tokens", label: "Tokens", dataType: "object", cardinality: "one", required: false },
      { id: "out-css-vars", label: "CSS Vars", dataType: "object", cardinality: "one", required: false },
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
  "Network / IO": "#06b6d4",
  Process: "#e879f9",
  Infrastructure: "#fb923c",
  "AI / ML": "#a3e635",
  Music: "#f472b6",
  Aggregations: "#38bdf8",
  Monitoring: "#818cf8",
  "UI Templates / Atoms": "#e2e8f0",
  "UI Templates / Molecules": "#cbd5e1",
  "UI Templates / Organisms": "#93c5fd",
  "UI Templates / Templates": "#7dd3fc",
  "UI Templates / Pages": "#38bdf8",
  "UI Templates / Design Tokens": "#67e8f9",
};
