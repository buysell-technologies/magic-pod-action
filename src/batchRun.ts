import {
  postCrossBatchRun,
  type Params as CrossBatchRunParams,
} from "./api/postCrossBatchRun";
import { getBatchRun } from "./api/getBatchRun";
import { setTimeout } from "timers/promises";

export type Params = {
  /** default is 300 (5min) */
  estimatedTime?: number;
  /** limit value of seconds to wait for completion. default is equal to estimatedTime */
  waitLimit?: number;
  /** default is 30 sec */
  retryInterval?: number;
  /** default is equal to retryInterval */
  initRetryInterval?: number;
} & CrossBatchRunParams;

/**
 * ExecuteBatchRun starts batch run(s) and wait for its completion with showing progress
 */
export const executeBatchRun: (params: Params) => Promise<boolean> = async ({
  apiToken,
  organization,
  project,
  testSettingNumber,
  estimatedTime = 300,
  waitLimit = estimatedTime,
  retryInterval = 30,
  initRetryInterval = retryInterval,
}) => {
  console.log("starting test...");
  const batchRun = await postCrossBatchRun({
    apiToken,
    organization,
    project,
    testSettingNumber,
  });

  if (!batchRun) {
    console.log("failed to start cross-batch-run");
    return true;
  }

  console.log(`started ${batchRun.test_setting_name} successfully`);
  console.log("detail: ", batchRun.url);

  const totalTestCount = batchRun.test_cases.total;
  console.log(`wait until ${totalTestCount} tests to be finished...`);

  const limitSeconds =
    waitLimit ?? totalTestCount * initRetryInterval * retryInterval; // wait up to test count x 10 minutes by default

  const startTime = new Date().getTime();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const batchRunUnderProgress = await getBatchRun({
      organization,
      project,
      apiToken,
      batchRunNumber: batchRun.batch_run_number,
    });

    if (!batchRunUnderProgress) {
      console.error("error");
      return true;
    }

    if (batchRunUnderProgress.status === "succeeded") {
      console.log("successfully finished!");
      return false;
    }

    if (batchRunUnderProgress.status !== "running") {
      console.log("finished: ", batchRunUnderProgress.status);
      return true;
    }

    console.log(batchRunUnderProgress.test_cases);

    const passedMs = new Date().getTime() - startTime;

    // wait for interval passes
    const sleepSecond =
      passedMs < estimatedTime * 1000 ? initRetryInterval : retryInterval;
    await setTimeout(sleepSecond * 1000);

    // wait limit has come
    if (passedMs > limitSeconds * 1000) {
      console.error("wait limit has come");
      return true;
    }
  }
};
