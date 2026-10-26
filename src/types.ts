/**
 * src/types.ts
 * Tipi TypeScript per i nodi, lo schema MSC2020, il grafo e le traduzioni di Mathema.
 */

export type LeanStatus = "none" | "statement_only" | "has_sorry" | "compiled";

export type NodeKind =
  | "definition"
  | "lemma"
  | "theorem"
  | "corollary"
  | "proof"
  | "technique"
  | "example"
  | "exercise"
  | "remark";

export type DependencyType =
  | "requires"
  | "generalizes"
  | "special_case_of"
  | "alternative_proof_of"
  | "applies_to"
  | "part_of";

export interface LeanBlock {
  code: string;
  status: LeanStatus;
  mathlib_version: string;
  mathlib_name?: string;
  lean_file?: string;
  verified_at?: string | null;
}

export interface Dependency {
  id: string;
  type: DependencyType;
}

export interface StepNode {
  id: string;
  kind: NodeKind;
  title: Record<string, string>;
  natural: Record<string, string>;
  symbolic: string;
  lean: LeanBlock;
  deps: Dependency[];
  substeps?: StepNode[];
}

export interface Attachment {
  id: string;
  kind: "svg" | "plot2d" | "scene3d";
  title: Record<string, string>;
  caption: Record<string, string>;
  svg?: string;
  preset?: string;
}

export interface SourceRef {
  title: string;
  citation: string;
  url?: string;
  license_note: string;
}

export interface MathemaNode {
  id: string;
  msc: string;
  kind: NodeKind;
  title: Record<string, string>;
  natural: Record<string, string>;
  symbolic: string;
  lean: LeanBlock;
  deps: Dependency[];
  children: string[];
  steps: StepNode[];
  attachments: Attachment[];
  sources: SourceRef[];
  license: "CC-BY-SA-4.0" | "Apache-2.0";
  provenance: "human" | "ai-assisted" | "imported";
  reviewed_by: string[];
}

export interface MscItem {
  code: string;
  official?: string;
  parent?: string;
  title: Record<string, string>;
}

export interface LanguagePack {
  code: string;
  label: string;
  name: string;
  dir: "ltr" | "rtl";
  ui: {
    root: string;
    search_placeholder: string;
    filter_all_kinds: string;
    view_text: string;
    view_graph: string;
    view_hybrid: string;
    rep_natural: string;
    rep_symbolic: string;
    rep_lean: string;
    expand_all: string;
    collapse_all: string;
    show_graph_selection: string;
    clear_selection: string;
    select_step: string;
    select_node: string;
    empty_section: string;
    home_intro: string;
    home_start_nodes: string;
    msc_extension_note: string;
    lean_status_label: string;
    lean_status_compiled: string;
    lean_status_has_sorry: string;
    lean_status_statement_only: string;
    lean_status_none: string;
    mathlib_ref: string;
    verified_at: string;
    deps_heading: string;
    alt_proofs_heading: string;
    steps_heading: string;
    attachments_heading: string;
    load_3d_button: string;
    sources_heading: string;
    ai_tools_button: string;
    ai_unverified_warning: string;
    install_pwa: string;
    offline_badge: string;
    toggle_nav: string;
    theme_toggle: string;
    docs_link: string;
    kinds: Record<string, string>;
    dep_types: Record<string, string>;
  };
}

export interface GraphNodeSummary {
  id: string;
  parentId: string;
  msc: string;
  kind: NodeKind;
  title: Record<string, string>;
  leanStatus: LeanStatus;
  isStep: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: DependencyType;
}

export interface SearchHit {
  id: string;
  official?: string;
  msc?: string;
  kind: string;
  leanStatus?: LeanStatus;
  isStep?: boolean;
  title: Record<string, string>;
  keywords: string;
}

export interface MathemaBundle {
  generatedAt: string;
  languages: Record<string, LanguagePack>;
  msc2020: {
    version: string;
    source: string;
    extension_policy: string;
    disciplines: MscItem[];
    sections: MscItem[];
    entries: MscItem[];
  };
  nodes: Record<string, MathemaNode>;
  entities: Record<string, any>;
  graph: {
    nodes: GraphNodeSummary[];
    edges: GraphEdge[];
  };
  searchIndex: SearchHit[];
}
