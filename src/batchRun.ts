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

/**
 * ExecuteBatchRun starts batch run and wait for its completion with showing progress
 */
export const executeBatchRun: (params: Params) => Promise<boolean> = async ({
  apiToken,
  organization,
  project,
  testSettingNumber,
  estimatedTime = 300,
  waitLimit = estimatedTime + 120,
  retryInterval = 10,
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

  console.log("started successfully");
  console.log("test_name: ", batchRun.test_setting_name);
  console.log("detail: ", batchRun.url);

  console.log(batchRun.test_cases.total, "tests is running...");

  const startTime = new Date().getTime();

  console.log(`wait until the expected ${estimatedTime} sec passes...`);
  await setTimeout(estimatedTime * 1000);

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
      console.log(batchRunUnderProgress.finished_at);
      return false;
    }

    if (batchRunUnderProgress.status !== "running") {
      console.log("finished: ", batchRunUnderProgress.status);
      console.log(batchRunUnderProgress.finished_at);
      return true;
    }

    console.log("running...");

    const passedMs = new Date().getTime() - startTime;

    // wait for interval passes
    await setTimeout(retryInterval * 1000);

    if (passedMs > waitLimit * 1000) {
      console.error("wait limit has come");
      return true;
    }
  }
};
