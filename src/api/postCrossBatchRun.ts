import axios from "axios/index";
import type { BatchRun } from "../@types/batchRun";
import { BASE_URL, type BaseParams } from "./base";

export type Params = {
  testSettingNumber: number;
} & BaseParams;

/**
 * cross-batch-runを開始する
 * @param apiToken
 * @param organization
 * @param project
 * @param testSettingNumber
 */
export const postCrossBatchRun: (
  params: Params
) => Promise<{ data: BatchRun; error: Error | null }> = async ({
  apiToken,
  organization,
  project,
  testSettingNumber,
}) => {
  // TODO: errorハンドル
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Token ${apiToken}` },
  });

  const payload = {
    test_settings_number: testSettingNumber,
  };

  const res = await instance.post(
    `/${organization}/${project}/cross-batch-run/`,
    payload
  );

  const data: BatchRun = res.data;

  return { data, error: null };
};
