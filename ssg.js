const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
var showdown  = require('showdown'),
    converter = new showdown.Converter();

class SSG {
    filePaths = [];
    toBeGenerated = [];
    generatedFiles = [];
    constructor(inputPath, outputPath, lang) {
        this.inputPath = inputPath;
        this.outputPath = outputPath ? outputPath : './dist';
        this.lang = lang ? lang : 'en-CA';
    }
    createIndexHtmlFile = () => {
        return new Promise(async (resolve, reject) => {
            const links = this.generatedFiles.map((param, index) => {
                let line = `<a style="display:block" href=${path.basename(param).replace(/\s/g, "%20")}>${path.basename(param, '.html')}</a>\n`;
                if(index == 0)
                    line = `<h1>Index</h1>\n<a style="display:block" href=${path.basename(param).replace(/\s/g, "%20")}>${path.basename(param, '.html')}</a>\n`;
                return line;
            }).join('');
            const html = this.createHTML2(links, 'Index'); 
            await this.writeHTMLFile(path.join(this.outputPath, "index.html"), html)
            resolve();
        })
    }
    createHTML2 = (htmlString, title) => {
        const html = `<!DOCTYPE html>
        <html lang="${this.lang}">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>${title}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css" />
          </head>
          <body>
            <main>
              <div class="mainContent">
                ${htmlString}
              </div>
            </main>
          </body>
        </html>`;
        return html; 
    }
    /**
       * writeHTMLFiles takes in 2 parameters fullOutputPath, htmlString and write the files to output path
       * @param {string} fullOutPutPath the output path + filename + file extension
       * @param {string} htmlString the html string 
    */
    writeHTMLFile = (fullOutputPath, htmlString) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                fullOutputPath,
                htmlString,
                (err) => {
                    if (err) {
                        console.error(`Unable to create file ${fullOutputPath}`);
                        reject();
                    }
                    else {  
                        console.log("\x1b[36m", `${fullOutputPath} is created`, "\x1b[0m");
                        this.generatedFiles.push(fullOutputPath);
                        resolve();
                    }
                }
            );
        })
    };
    /** 
    *  Look for title and convert text files into html strings and push outputPath and htmlString to tobeGenerated array
    *  @param {string} filePath from commandLine
    *  @param {string} fileType the file extension
    */
    createHTMLFile = (filePath, fileType) => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', async (err, data) => {
                let title; 
                let html;
                if (err) 
                    return console.error(`Unable to read file ${filePath}`, err);
                const fullOutputPath = path.join(this.outputPath, `${path.basename(filePath, fileType)}.html`)
                if(fileType == ".md") {
                    if (data.match(/^\s*#{1,6}[^#\n]+/)) 
                        title = data.match(/^\s*#{1,6}[^#\n]+/)[0].replace(/\#{1,6}/, "").trim();
                    html = this.createHTML2(converter.makeHtml(data), title);
                    resolve();
                }
                if(fileType == ".txt") {
                    if (data.match(/^.+(\r?\n\r?\n\r?\n)/)) {
                        title = data.match(/^.+(\r?\n\r?\n\r?\n)/)[0].match(/(\w+)/g).join(" ");
                        data = data.slice(data.match(/^.+(\r?\n\r?\n\r?\n)/)[0].length, data.length);
                    }
                    let content = data
                        .split(/\r?\n\r?\n/)
                        .map(para =>
                            `<p>${para.replace(/\r?\n/, ' ')}</p>`
                        )
                        .join(' ');
                    content = (`<h1>${title}</h1>\n`).concat(content);
                    html = this.createHTML2(content, title)
                    resolve();
                }
                this.toBeGenerated.push({fullOutputPath, html}); 
            });
        })  
    }
    /**
     * readInput takes in 'filePath', it checks if parameter is a file (call createHTMLFile) or directory (recursive until it's got a file) and push to filePaths
     * @param {string} filePath input path from command
     */
    readInput = (filePath) => {
        const stat = fs.lstatSync(filePath);
        if (!stat.isFile() && stat.isDirectory()) {
            fs.readdirSync(filePath).forEach((inDir) => {
                //recursive until a .txt or .md file is recognized
                this.readInput(`${filePath}/${inDir}`);
            })
        }
        else if (stat.isFile() && path.extname(filePath) == ".txt") {
            //this.createHTMLFile(filePath, ".txt");
            this.filePaths.push(filePath);
        }
        else if (stat.isFile() && path.extname(filePath) == ".md") {
            this.filePaths.push(filePath);
        }
    }

    /**
     *  processInput processes input <filepath> and creates index.html
     *  @param {string} filePath input path from command
     */
    processInput = async (filepath) => {
        if (!fs.existsSync(this.outputPath))
            fs.mkdirSync(this.outputPath);
        //delete previous html files in the output folder after generating new html files
        fs.readdirSync(this.outputPath).forEach(file => {
            const outputFolderFile = path.join(this.outputPath, file);
            if (this.filePaths.indexOf(outputFolderFile) < 0 && path.extname(outputFolderFile) == "html") {
                fs.unlink(outputFolderFile, (err) => {
                    if (err)
                        console.error(err);
                })
            }
        });
        this.readInput(filepath);

        await Promise.all(this.filePaths.map(async (file) => {
            await this.createHTMLFile(file, path.extname(file));
        }))
        await Promise.all(this.toBeGenerated.map(async (param) => {
            await this.writeHTMLFile(param.fullOutputPath, param.html);
        }))
        this.createIndexHtmlFile();
    }
}
module.exports.SSG = SSG;