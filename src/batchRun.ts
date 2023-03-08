import {
  postCrossBatchRun,
  type Params as CrossBatchRunParams,
} from "./api/postCrossBatchRun";
import { getBatchRun } from "./api/getBatchRun";
import { setTimeout } from "timers/promises";

export type Params = {
  /** estimated test run time. completion of the test is not detected until this time. default is 300 sec */
  estimatedTime?: number;
  /** limit value of seconds to wait for completion. default is equal to estimatedTime + 120 sec */
  waitLimit?: number;
  /** retry interval after exceeding estimated time. default is 10 sec */
  retryInterval?: number;
} & CrossBatchRunParams;

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: Error;
    };

/**
 * ExecuteBatchRun starts batch run and wait for its completion with showing progress
 *
 * This function is from Magic-Pod/magicpod-api-client (common/common.go executeBatchRun())
 * @see https://github.com/Magic-Pod/magicpod-api-client
 */
export const executeBatchRun: (params: Params) => Promise<Result> = async ({
  apiToken,
  organization,
  project,
  testSettingNumber,
  estimatedTime = 300,
  waitLimit = estimatedTime + 120,
  retryInterval = 10,
}) => {
  if (testSettingNumber === 0) {
    return { success: false, error: new Error("invalid test setting number") };
  }
  console.log("starting test...");

  const batchRun = await postCrossBatchRun({
    apiToken,
    organization,
    project,
    testSettingNumber,
  });
  if (!batchRun) {
    return {
      success: false,
      error: new Error("failed to start cross-batch-run"),
    };
  }

  console.log("started successfully");
  console.log("test_name:", batchRun.test_setting_name);
  console.log("detail:", batchRun.url);

  console.log(batchRun.test_cases.total, "tests is running...");

  const startTime = new Date().getTime();

  console.log(`wait until the expected ${estimatedTime} sec passes...`);
  await setTimeout(estimatedTime * 1000);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: batchRunUnderProgress, error } = await getBatchRun({
      organization,
      project,
      apiToken,
      batchRunNumber: batchRun.batch_run_number,
    });

    if (error) {
      console.error(error.code);
      console.error(error.message);
      if (error.response) {
        console.error(error.response.data.detail);
      }
      return {
        success: false,
        error: new Error("could not get batch run status"),
      };
    }

    if (batchRunUnderProgress.status === "succeeded") {
      console.log("successfully finished!");
      console.log(batchRunUnderProgress.finished_at);
      return { success: true };
    }

    if (batchRunUnderProgress.status !== "running") {
      return {
        success: false,
        error: new Error(
          `finished with status: ${batchRunUnderProgress.status}\nfinished at: ${batchRunUnderProgress.finished_at}`
        ),
      };
    }

    console.log("running...");

    const passedMs = new Date().getTime() - startTime;

    // wait for interval passes
    await setTimeout(retryInterval * 1000);

    if (passedMs > waitLimit * 1000) {
      return { success: false, error: new Error("wait limit has come") };
    }
  }
};
