# magic-pod-action

![](https://img.shields.io/github/package-json/v/buysell-technologies/magic-pod-action)
![](https://img.shields.io/github/license/buysell-technologies/magic-pod-action)

GitHub Actions for [MagicPod](https://magicpod.com/)

Starts batch run and wait for its completion.

## Inputs

### `API_TOKEN` (required)

MagicPod API Token.

### `ORGANIZATION` (required)

MagicPod Organization name.

### `PROJECT` (required)

MagicPod Project name.

### `TEST_SETTINGS_NUMBER` (required)

Test settings number defined in the project batch run page. 

### `ESTIMATED_TIME`

Estimated test run time. completion of the test is not detected until this time. default is 300 sec.

### `RETRY_INTERVAL`

Retry interval after exceeding estimated time. default is 10 sec.

### `WAIT_LIMIT`

Limit value of seconds to wait for completion. default is equal to estimatedTime + 120 sec.


## Example usage

```yml
name: Release

on:
  push:
    branches:
      - your release branch

jobs:
  magic-pod-test:
    needs: deploy-stg
    uses: buysell-technologies/magic-pod-action@v0.1
    with:
      API_TOKEN: ${{ secrets.MAGIC_POD_API_TOKEN }}
      ORGANIZATION: your-organization
      PROJECT: your-project
      TEST_SETTING_NUMBER: "123"
      ESTIMATED_TIME: "300"
      RETRY_INTERVAL: "10"
      WAIT_LIMIT: "600"

  deploy:
    needs: magic-pod-test
    uses: ./.github/workflows/your-deploy-workflow.yml
    secrets: inherit
```
