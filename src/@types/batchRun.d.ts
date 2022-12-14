export type Status = "running" | "succeeded" | "failed" | "aborted" | "unresolved";

type DataPattern = {
  data_index: number;
  status: Status | "not-running";
  started_at: string;
  finished_at: string;
};

type Result = {
  order: number;
  number: number;
  status: Status | "not-running";
  started_at: string;
  finished_at: string;
  data_patterns: DataPattern[] | null;
};


type Detail = {
  pattern_name: string | null;
  included_labels: string[];
  excluded_labels: string[];
  results: Result[];
};

export type TestCases = {
  succeeded: number;
  failed: number;
  aborted: number;
  unresolved: number;
  total: number;
  details: Detail[];
};

export type BatchRun = {
  organization_name: string;
  project_name: string;
  batch_run_number: number;
  test_setting_name: string;
  status: Status;
  started_at: string;
  finished_at: string;
  test_cases: TestCases;
  url: string;
};
