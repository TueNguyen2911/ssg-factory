# Javascript Static Site Generateor (SSG)
A Javascript command line program that converts **.txt** files into **.html** files. 

## Implemented features 
- **Parsing titles** from .txt files => .html files to have `<h1>` and `<title>` tags
- User can **specify output folder path**, instead of placing .html files in './dist' by default
- If **input path** is a **folder**, it will look for all .txt files in the **folder** and in **subfolder(s)**
- An `index.html` contains **links to other .html files** in folder.