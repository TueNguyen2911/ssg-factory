# Javascript Static Site Generator (SSG)

A Javascript command line program that converts **.txt** and **.md** files into **.html** files.

## Implemented features

- Specifying a language to add to html tag
- Parsing titles from .txt files => .html files to have `<h1>` and `<title>` tags
- User can specify output folder path, instead of placing .html files in `./dist` by default
- If `input path` is a folder, it will look for all `.txt` and `.md` files in the folder and in subfolder(s)
- An `Index.html` contains links to other `.html` files created in folder.
- Fully support parsing markdown files.
- User can **specify a JSON formatted config file** to store options, instead of passing options as command line arguments

## How to use:

Run one of these commands in your terminal

```
npx ssg-factory -i ./textfiles/file.txt
```

Converting `file.txt` in `./textfiles/` to `html`

```
npx ssg-factory -i ./textfiles
```

Converting all `.txt` files found in `./textfiles` folder

```
npx ssg-factory -i ./textfiles -o ./outputFiles
```

Converting all `.txt` files found in `./textfiles` folder and place `html` output files in `./outputFiles`

Parsing JSON formatted config file with options.
Use of `-c` or `--config` will ignore `-i`, `-o`, `-l` options in the command line.

```json
{
  "input": "./bin/test/samples",
  "output": "./build",
  "stylesheet": "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
  "lang": "en-CA"
}
```

```
node index.js -c configFile.json
```

## Help

```
Usage: index [options]

Options:
  -V, --version            output the version number
  -o, --output <path>      specify a path for .html files output
  -i, --input <file path>  (required) transform .txt or .md files into .html files
  -h, --help               display help for command
```
