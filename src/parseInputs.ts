import * as core from "@actions/core";
import { Params } from "./batchRun";

export const parseInputs = (): Params => {
  const apiToken = core.getInput("API_TOKEN");
  const organization = core.getInput("ORGANIZATION");
  const project = core.getInput("PROJECT");

  const testSettingNumber = getNumberInput("TEST_SETTING_NUMBER", true);
  const estimatedTime = getNumberInput("ESTIMATED_TIME");
  const waitLimit = getNumberInput("WAIT_LIMIT");
  const retryInterval = getNumberInput("RETRY_INTERVAL");

  return {
    apiToken,
    organization,
    project,
    testSettingNumber,
    estimatedTime,
    waitLimit,
    retryInterval,
  };
};

type Key =
  | "TEST_SETTING_NUMBER"
  | "ESTIMATED_TIME"
  | "WAIT_LIMIT"
  | "RETRY_INTERVAL";

export const getNumberInput = <T extends boolean>(
  key: Key,
  required?: T
): T extends true ? number : number | undefined => {
  const value = core.getInput(key);
  if (value === "") {
    if (required) throw new Error(`input ${key} is empty`);
    return <T extends true ? number : number | undefined>undefined;
  }
  if (Number.isNaN(Number(value)))
    throw new Error(`input ${key} is not a number`);

  return parseInt(value);
};
