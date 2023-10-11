# MicroEJ Checker

An unofficial tool that integrates with GitHub Actions to provide various checks.

## Development environment

First, do a `npm install` to obtain all the dependencies.

To start the tool locally, use `npm run start`. A path to a project directory needs to be provided (see below).

## Configuring the project

In your project's Git root, create a file called `.microej_check`. An example configuration:

```json
{
    "poCheck": {
        "filePattern": "*/src/main/resources/**/*.po",
        "missingTranslationLogLevel": "error"
    }
}
```

This will enable the PO check module and start looking for .po files in each subfolder of the root directory (not recursive).

## GitHub integration

Here is a sample workflow on how to integrate this with GitHub actions:

```yaml
name: "PR Checks"
on:
  push:
jobs:
  microej_check_job:
    runs-on: ubuntu-latest
    name: Check translation (.po) files
    steps:
      - name: Checkout the current branch
        uses: actions/checkout@v2

      - name: Check for missing translations
        id: microej_check
        uses: eliandoran/microej-check@master
        with:
          config: ./etc/ci/microej_check/normal_branch.json
```