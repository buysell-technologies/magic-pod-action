import * as core from "@actions/core";
import { executeBatchRun } from "./batchRun";
import { parseInputs } from "./parseInputs";

const main = async () => {
  const inputs = parseInputs();
  const res = await executeBatchRun(inputs);

  if (!res.success) {
    console.error(res.error.message);
    core.setFailed("test failed");
  }
};

main().catch((e) => {
  if (typeof e === "string" || e instanceof Error) core.setFailed(e);
  else core.setFailed("unexpected error has occurred");
});
