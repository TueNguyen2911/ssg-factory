1.  Clone this project
2.  Install [node](https://nodejs.org/en/) on your machine
3.  Install dependencies by using `npm install`

The project enforces the use of `Prettier`, `EsLint` and pre-commit hook with `husky` and `lint-staged`

## Formating

To format your code, run

```bash
npx prettier --write .
```

If you're using VSCode as your editor, `Prettier` should format your file on saving

## Linting

Always check linting errors before you commit/push, to check linting errors, run

```bash
npx eslint .
```

You can format certain files by replacing `.` to `<file paths>` for `linting` and `formating`
