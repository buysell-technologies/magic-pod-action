import axios, { type AxiosError } from "axios";
import type { BatchRun } from "../@types/batchRun";
import { BASE_URL, type BaseParams } from "./base";

type BatchRunError = AxiosError<{ detail: string }>;

export type Params = {
  testSettingNumber: number;
} & BaseParams;

type PostCrossBatchRun = (
  params: Params
) => Promise<
  { data: BatchRun; error: null } | { data: null; error: BatchRunError }
>;

/**
 * cross-batch-runを開始する
 */
export const postCrossBatchRun: PostCrossBatchRun = async ({
  apiToken,
  organization,
  project,
  testSettingNumber,
}) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Token ${apiToken}` },
  });

  const payload = {
    test_settings_number: testSettingNumber,
  };

  return await instance
    .post<BatchRun>(`/${organization}/${project}/cross-batch-run/`, payload)
    .then((res) => ({ data: res.data, error: null }))
    .catch((error: BatchRunError) => ({ data: null, error }));
};
