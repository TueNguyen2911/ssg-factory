const fs = require("fs");
/**
 * WriteHtmlFile is responsible for writing file to output folder
 */
class WriteHtml {
  constructor(outputPath, htmlString) {
    this.outputPath_ = outputPath;
    this.htmlString_ = htmlString;
  }
  setOutputPath = (outputPath) => {
    this.outputPath_ = outputPath;
  };
  setHtmlString = (htmlString) => {
    this.htmlString_ = htmlString;
  };
  /**
   * Write file to output folder
   * @returns a Promise resolve of the file outputPath
   */
  writeHtmlFileToOutputFolder = () => {
    return new Promise((resolve) => {
      fs.writeFileSync(this.outputPath_, this.htmlString_);
      console.log(require("chalk").green(`${this.outputPath_} is created`));
      resolve(this.outputPath_);
    });
  };
}

module.exports.WriteHtml = WriteHtml;
