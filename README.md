# magic-pod-action

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

```
    steps:
      - name: checkout with private repository
        uses: actions/checkout@v3
        with:
          repository: buysell-technologies/magic-pod-action
          path: ./.github/actions/magic-pod
          ref: main
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}  # need PAT with repo authority

      - name: execute magic-pod-action
        uses: ./.github/actions/magic-pod
        with:
          API_TOKEN: ${{ secrets.MAGIC_POD_API_TOKEN }}
          ORGANIZATION: "Organization name"
          PROJECT: "Project name"
          TEST_SETTINGS_NUMBER: "1"
          WAIT_LIMIT: "120"
```
