const fs = require("fs");
const path = require("path");
const hljs = require("highlight.js");
const md = require("markdown-it")({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (e) {
        console.error(e);
      }
    }
    return "";
  }
});

class SSG {
  filePaths_ = [];
  toBeGenerated_ = [];
  generatedFiles_ = [];
  constructor(inputPath, outputPath, lang) {
    this.inputPath_ = inputPath;
    this.outputPath_ = outputPath ? outputPath : "./dist";
    this.lang_ = lang ? lang : "en-CA";
  }
  /**
   * createIndexHtmlFile creates index file.
   * @returns
   */
  createIndexHtmlFile = () => {
    return new Promise((resolve, reject) => {
      const links = this.generatedFiles_
        .map((param, index) => {
          let line = `<a style="display:block" href=${path
            .basename(param)
            .replace(/\s/g, "%20")}>${path.basename(param, ".html")}</a>\n`;
          if (index == 0) {
            line = `<h1>Index</h1>\n<a style="display:block" href=${path
              .basename(param)
              .replace(/\s/g, "%20")}>${path.basename(param, ".html")}</a>\n`;
            }
          return line;
        })
        .join("");
      const html = this.createHTML(links, "Index");

      let write = async () => {
        this.writeHTMLFile(path.join(this.outputPath_, "index.html"), html);
      };
      write()
        .then(() => resolve)
        .catch(() => reject());
    });
  };
  /**
   * createHTML interpolates "htmlString" and "title" into the html boiler plate
   * @param {string} htmlString the body of the html file
   * @param {string} title title of the html file
   * @returns the html file as string
   */
  createHTML = (htmlString, title) => {
    const html = `<!DOCTYPE html>
        <html lang="${this.lang_}">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">
            <title>${title}</title>
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
  };
  /**
   * writeHTMLFiles takes in 2 parameters fullOutputPath, htmlString and write the files to output path
   * @param {string} fullOutPutPath the output path + filename + file extension
   * @param {string} htmlString the html string
   */
  writeHTMLFile = (fullOutputPath, htmlString) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(fullOutputPath, htmlString, (err) => {
        if (err) {
          console.error(`Unable to create file ${fullOutputPath}`);
          reject();
        } else {
          console.log("\x1b[36m", `${fullOutputPath} is created`, "\x1b[0m");
          this.generatedFiles_.push(fullOutputPath);
          resolve();
        }
      });
    });
  };
  /**
   *  Look for title and convert text files into html strings and push outputPath and htmlString to tobeGenerated_ array
   *  @param {string} filePath from commandLine
   *  @param {string} fileType the file extension
   */
  createHTMLFile = (filePath, fileType) => {
    return new Promise((resolve) => {
      (async () => {
        try {
          let data = await fs.promises.readFile(filePath, "utf-8");
          let title;
          let html;
          const fullOutputPath = path.join(
            this.outputPath_,
            `${path.basename(filePath, fileType)}.html`
          );
          if (fileType == ".md") {
            if (data.match(/^\s*#{1,6}[^#\n]+/)) {
              title = data
                .match(/^\s*#{1,6}[^#\n]+/)[0]
                .replace(/#{1,6}/, "")
                .trim();
            }
            html = this.createHTML(md.render(data), title);
            this.toBeGenerated_.push({ fullOutputPath, html });
            resolve();
          }
          if (fileType == ".txt") {
            if (data.match(/^.+(\r?\n\r?\n\r?\n)/)) {
              title = data
                .match(/^.+(\r?\n\r?\n\r?\n)/)[0]
                .match(/(\w+)/g)
                .join(" ");
              data = data.slice(
                data.match(/^.+(\r?\n\r?\n\r?\n)/)[0].length,
                data.length
              );
            }
            let content = data
              .split(/\r?\n\r?\n/)
              .map((para) => `<p>${para.replace(/\r?\n/, " ")}</p>`)
              .join(" ");
            content = `<h1>${title}</h1>\n`.concat(content);
            html = this.createHTML(content, title);
            this.toBeGenerated_.push({ fullOutputPath, html });
            resolve();
          }
        } catch(err) {
          console.error(err);
        }
      })();
    });
  };
  /**
   * readInput takes in 'filePath', it checks if parameter is a file (call createHTMLFile) or directory (recursive until it's got a file) and push to filePaths_
   * @param {string} filePath input path from command
   */
  readInput = (filePath) => {
    try {
      const stat = fs.lstatSync(filePath);
      if (!stat.isFile() && stat.isDirectory()) {
        fs.readdirSync(filePath).forEach((inDir) => {
          //recursive until a .txt or .md file is recognized
          this.readInput(`${filePath}/${inDir}`);
        });
      } else if (stat.isFile() && path.extname(filePath) == ".txt") {
        //this.createHTMLFile(filePath, ".txt");
        this.filePaths_.push(filePath);
      } else if (stat.isFile() && path.extname(filePath) == ".md") {
        this.filePaths_.push(filePath);
      }
    } catch (error) {
      console.error(error);
      process.exit(0);
    }
  };

  /**
   *  processInput processes input <filepath> and creates index.html
   *  @param {string} filePath input path from command
   */
  processInput = async (filepath) => {
    if (!fs.existsSync(this.outputPath_)) {
      fs.mkdirSync(this.outputPath_);
    }
    //delete previous html files in the output folder after generating new html files
    fs.readdirSync(this.outputPath_).forEach((file) => {
      const outputFolderFile = path.join(this.outputPath_, file);
      if (path.extname(outputFolderFile) == "html") {
        fs.unlink(outputFolderFile, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
    this.readInput(filepath);
    if (this.filePaths_.length == 0) {
      console.error("Empty directory, nothing to convert, bye bye");
      process.exit(0);
    } else {
      //this.toBeGenerated_ = [...this.filePaths_];

      await Promise.all(
        this.filePaths_.map(async (file) => {
          console.log(file);
          await this.createHTMLFile(file, path.extname(file));
        })
      );
      await Promise.all(
        this.toBeGenerated_.map(async (param) => {
          await this.writeHTMLFile(param.fullOutputPath, param.html);
        })
      );
      this.createIndexHtmlFile();
    }
  };
}
module.exports.SSG = SSG;
