import * as core from "@actions/core";
import { executeBatchRun } from "./batchRun";

const main = async () => {
  const apiToken = core.getInput("API_TOKEN");
  const organization = core.getInput("ORGANIZATION");
  const project = core.getInput("PROJECT");

  const testSettingNumber = Number(core.getInput("TEST_SETTING_NUMBER"));
  const estimatedTime = Number(core.getInput("ESTIMATED_TIME")) || undefined;
  const waitLimit = Number(core.getInput("WAIT_LIMIT")) || undefined;
  const retryInterval = Number(core.getInput("RETRY_INTERVAL")) || undefined;

  const isFailed = await executeBatchRun({
    apiToken,
    organization,
    project,
    testSettingNumber,
    estimatedTime,
    waitLimit,
    retryInterval,
  });

  if (isFailed) {
    core.setFailed("test failed");
  }
};

try {
  main();
} catch (e) {
  core.setFailed("unexpected error has occurred");
}
