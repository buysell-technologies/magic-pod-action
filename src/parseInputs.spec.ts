import { getNumberInput, parseInputs } from "./parseInputs";

const context = describe;

describe("parseInputs", () => {
  context("when all inputs is filled", () => {
    it("get parsed", () => {
      process.env = {
        INPUT_API_TOKEN: "api-token",
        INPUT_ORGANIZATION: "my-organization",
        INPUT_PROJECT: "my-project",
        INPUT_TEST_SETTING_NUMBER: "1",
        INPUT_ESTIMATED_TIME: "60",
        INPUT_WAIT_LIMIT: "300",
        INPUT_RETRY_INTERVAL: "10",
      };

      const expected = {
        apiToken: "api-token",
        organization: "my-organization",
        project: "my-project",
        testSettingNumber: 1,
        estimatedTime: 60,
        waitLimit: 300,
        retryInterval: 10,
      };

      const actual = parseInputs();
      expect(actual).toStrictEqual(expected);
    });
  });

  context("when all required inputs is filled", () => {
    it("get parsed", () => {
      process.env = {
        INPUT_API_TOKEN: "api-token",
        INPUT_ORGANIZATION: "my-organization",
        INPUT_PROJECT: "my-project",
        INPUT_TEST_SETTING_NUMBER: "1",
      };

      const expected = {
        apiToken: "api-token",
        organization: "my-organization",
        project: "my-project",
        testSettingNumber: 1,
        estimatedTime: undefined,
        waitLimit: undefined,
        retryInterval: undefined,
      };

      const actual = parseInputs();
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("getNumberInput", () => {
  context("with valid input", () => {
    it("return parsed int", () => {
      process.env.INPUT_TEST_SETTING_NUMBER = "1";
      const actual = getNumberInput("TEST_SETTING_NUMBER");
      expect(actual).toBe(1);
    });

    it("return undefined when input is empty string and not required", () => {
      process.env.INPUT_TEST_SETTING_NUMBER = "";
      const actual = getNumberInput("TEST_SETTING_NUMBER");
      expect(actual).toBe(undefined);
    });
  });

  context("with invalid input", () => {
    it("fail with NaN", () => {
      process.env.INPUT_TEST_SETTING_NUMBER = "foo";
      expect(() => getNumberInput("TEST_SETTING_NUMBER")).toThrow(
        "input TEST_SETTING_NUMBER is not a number"
      );
    });

    it("fail when input is empty string and required", () => {
      process.env.INPUT_TEST_SETTING_NUMBER = "";
      expect(() => getNumberInput("TEST_SETTING_NUMBER", true)).toThrow(
        "input TEST_SETTING_NUMBER is empty"
      );
    });
  });
});
