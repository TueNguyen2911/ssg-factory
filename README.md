# Javascript Static Site Generator (SSG)

A Javascript command line program that converts **.txt** and **.md** files into **.html** files. 

## Implemented features 

- **Parsing titles** from .txt files => .html files to have `<h1>` and `<title>` tags
- User can **specify output folder path**, instead of placing .html files in './dist' by default
- If **input path** is a **folder**, it will look for all .txt files in the **folder** and in **subfolder(s)**
- An `index.html` contains **links to other .html files** in folder.
- **Parsing Heading** from .md files => .html files to have `<h1>` to `h6` tags
- **Parsing Bold** text from .md files => .html files to have `<b>` tags
- **Parsing Italic** text from .md files => .html files to have `<i>` tags
- **Parsing Links** from .md files => .html files to have `<a href="">` tags

## Example:

###### file.txt 

```
Silver Blaze


I am afraid, Watson, that I shall have to go,” said Holmes, as we
sat down together to our breakfast one morning.

“Go! Where to?”

“To Dartmoor; to King’s Pyland.”
```

will be converted to 

###### file.html

```html 
<!DOCTYPE html>
<html>
   <head>
      <title>Silver Blaze</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css" />
   </head>
   <h1>Silver Blaze</h1>
   <body>
      <p>I am afraid, Watson, that I shall have to go,” said Holmes, as we
         sat down together to our breakfast one morning.
      </p>
      <p>“Go! Where to?”</p>
      <p>“To Dartmoor; to King’s Pyland.”</p>
   </body>
</html>
```

###### index.html for ./textfiles/

![Image of index.html](https://i.ibb.co/9YVnN1y/Screenshot-2021-09-14-003724.png)

## How to use: 

```
node index.js -i ./textfiles/file.txt
```

Converting `file.txt` in `./textfiles/` to `html`

```
node index.js -i ./textfiles 
```

Converting all `.txt` files found in `./textfiles` folder

```
node index.js -i ./textfiles -o ./outputFiles
```

Converting all `.txt` files found in `./textfiles` folder and place `html` output files in `./outputFiles`

```
node index.js -i sometext.txt 
node index.js -i markdownFile.md 
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

## Demo Link

https://tuenguyen2911.github.io/static-ssg-dps909/