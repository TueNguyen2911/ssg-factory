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
/**
 * ConvertToHtml converts .txt and .md file data into html (body), then interpolates that html into a html boiler plate
 */
class ConvertToHtml {
  constructor(lang, outputPath) {
    this.filePath_ = null;
    this.fileData_ = null;
    this.lang_ = lang;
    this.outputPath_ = outputPath;
  }
  setFilePath(filePath) {
    this.filePath_ = filePath;
  }
  setFileData(fileData) {
    this.fileData_ = fileData;
  }
  /**
   * interpolateHtml interpolates "htmlString" and "title" into the html boiler plate
   * @param {string} htmlString the body of the html file
   * @param {string} title title of the html file
   * @returns the html file as string
   */
  interpolateHtml = (htmlString, title) => {
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
   *  Look for title and convert text files into html strings by calling interpolateHtml(), resolves a
   * key-value pair of fullOutputPath and htmlString
   *  @param {string} filePath from commandLine
   *  @param {string} fileType the file extension
   */
  convertFileDataToHtml = () => {
    return new Promise((resolve) => {
      const fileType = path.extname(this.filePath_);
      const fullOutputPath = path.join(
        this.outputPath_,
        `${path.basename(this.filePath_, fileType)}.html`
      );
      let title = "";
      let htmlString = "";

      if (fileType == ".md") {
        if (this.fileData_.match(/^\s*#{1,6}[^#\n]+/)) {
          title = this.fileData_
            .match(/^\s*#{1,6}[^#\n]+/)[0]
            .replace(/#{1,6}/, "")
            .trim();
        }
        htmlString = this.interpolateHtml(md.render(this.fileData_), title);
        resolve({ fullOutputPath, htmlString });
      }
      if (fileType == ".txt") {
        if (this.fileData_.match(/^.+(\r?\n\r?\n\r?\n)/)) {
          title = this.fileData_
            .match(/^.+(\r?\n\r?\n\r?\n)/)[0]
            .match(/(\w+)/g)
            .join(" ");
          this.fileData_ = this.fileData_.slice(
            this.fileData_.match(/^.+(\r?\n\r?\n\r?\n)/)[0].length,
            this.fileData_.length
          );
        }
        let content = this.fileData_
          .split(/\r?\n\r?\n/)
          .map((para) => `<p>${para.replace(/\r?\n/, " ")}</p>`)
          .join(" ");
        content = `<h1>${title}</h1>\n`.concat(content);
        htmlString = this.interpolateHtml(content, title);
        resolve({ fullOutputPath, htmlString });
      }
    });
  };
}

module.exports.ConvertToHtml = ConvertToHtml;
