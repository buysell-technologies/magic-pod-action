import axios, { type AxiosError } from "axios";
import type { BatchRun } from "../@types/batchRun";
import { BASE_URL, BaseParams } from "./base";

type BatchRunError = AxiosError<{ detail: string }>;

type Params = {
  batchRunNumber: number;
} & BaseParams;

type GetBatchRun = (
  params: Params
) => Promise<
  { data: BatchRun; error: null } | { data: null; error: BatchRunError }
>;

/**
 * retrieves status and number of test cases executed of a specified batch run
 */
export const getBatchRun: GetBatchRun = async ({
  organization,
  project,
  apiToken,
  batchRunNumber,
}: Params) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Token ${apiToken}` },
  });

  return instance
    .get<BatchRun>(`/${organization}/${project}/batch-run/${batchRunNumber}/`)
    .then((res) => ({ data: res.data, error: null }))
    .catch((error: BatchRunError) => ({ data: null, error }));
};
