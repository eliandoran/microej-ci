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