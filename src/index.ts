import * as core from "@actions/core";

const main = () => {
  const arg = core.getInput('ARG');
  console.log(arg)
  core.setOutput("RES", `input: ${arg}`);
}

main();
