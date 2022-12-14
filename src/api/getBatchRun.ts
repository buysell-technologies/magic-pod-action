import axios from "axios";
import type { BatchRun } from "../@types/batchRun";
import { BASE_URL, BaseParams } from "./base";

type Params = {
  batchRunNumber: number;
} & BaseParams;

/**
 * retrieves status and number of test cases executed of a specified batch run
 * @param apiToken
 * @param organization
 * @param project
 * @param batchRunNumber
 */
export const getBatchRun: (
  params: Params
) => Promise<{ data: BatchRun; error: Error | null }> = async ({
  organization,
  project,
  apiToken,
  batchRunNumber,
}) => {
  // TODO: errorハンドル
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Token ${apiToken}` },
  });

  const res = await instance.get(
    `/${organization}/${project}/batch-run/${batchRunNumber}/`
  );

  const data: BatchRun = res.data;

  return { data, error: null };
};
