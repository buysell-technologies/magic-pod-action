import axios, { AxiosError } from "axios";
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
) => Promise<BatchRun | null> = async ({
  organization,
  project,
  apiToken,
  batchRunNumber,
}) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Token ${apiToken}` },
  });

  return await instance
    .get<BatchRun>(`/${organization}/${project}/batch-run/${batchRunNumber}/`)
    .then((res) => res.data)
    .catch((error: AxiosError<{ detail: string }>) => {
      console.log(error.code);
      console.log(error.response?.data.detail);
      return null;
    });
};
