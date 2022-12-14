import axios, { type AxiosError } from "axios/index";
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
) => Promise<BatchRun | null> = async ({
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
    .then((res) => res.data)
    .catch((error: AxiosError<{ detail: string }>) => {
      console.log(error.code);
      console.log(error.response?.data.detail);
      return null;
    });
};
