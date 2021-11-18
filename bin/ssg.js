const { HandleFolder } = require("./helpers/handleFolder");
const { ConvertToHtml } = require("./helpers/convertToHtml");
const { HandleInputPath } = require("./helpers/handleInputPath");
const { WriteHtmlFile } = require("./helpers/writeHtmlFile");
const { CreateIndexFile } = require("./helpers/createIndexFile");

/**
 * SSG class takes in all the command line options and generate html files
 */
class SSG {
  filePaths_ = [];
  toBeGenerated_ = [];
  generatedFiles_ = [];
  constructor(inputPath, outputPath, lang) {
    this.inputPath_ = inputPath;
    this.outputPath_ = outputPath ? outputPath : "./dist";
    this.lang_ = lang ? lang : "en-CA";
  }
  createFileInfos = () => {
    return new Promise((resolve) => {
      let promiseArray = [];
      let fileInfos = [];

      const handleInput = new HandleInputPath("textfiles");
      handleInput.handleInput();
      const initalData = handleInput.getData();
      if (initalData.ext == "folder") {
        initalData.result.then((paths) => {
          paths.forEach((path) => {
            handleInput.setFilePath(path);
            handleInput.handleInput();
            const folderData = handleInput.getData();
            promiseArray.push(folderData.result);
            fileInfos.push({
              path: path,
              fileData: ""
            });
          });
          (async () => {
            const temp = await Promise.all(promiseArray);
            temp.map((fileData, index) => {
              fileInfos[index].fileData = fileData;
            });
            resolve(fileInfos);
          })();
        });
      } else {
        initalData.result((fileData) => {
          fileInfos.push({ path: this.inputPath_, fileData: fileData });
        });
      }
    });
  };
  /**
   * main functions of SSG
   */
  generateFiles = async () => {
    let promiseArray = [];
    let response = null;
    //delete or create new output folder
    const handleFolder = new HandleFolder(this.outputPath_);
    handleFolder.createFolder();
    //handle input file path, fileInfos is an array of {path, fileData}
    const fileInfos = await this.createFileInfos();

    //convert fileData of files ".txt" and ".md" into htmlString;
    const convertToHtml = new ConvertToHtml(this.lang_, this.outputPath_);
    promiseArray = fileInfos.map((elem) => {
      convertToHtml.setFileData(elem.fileData);
      convertToHtml.setFilePath(elem.path);
      return convertToHtml.convertFileDataToHtml();
    });
    response = await Promise.all(promiseArray);
    const toBeWritten = response.map((converted) => {
      return {
        htmlString: converted.htmlString,
        fullOutputPath: converted.fullOutputPath
      };
    });

    //write html files to output folder
    const writeHtmlFile = new WriteHtmlFile(null, null);
    promiseArray = toBeWritten.map((converted) => {
      writeHtmlFile.setOutputPath(converted.fullOutputPath);
      writeHtmlFile.setHtmlString(converted.htmlString);
      return writeHtmlFile.writeHtmlFileToOutputFolder();
    });
    response = await Promise.all(promiseArray);
    response.map((generated) => {
      this.generatedFiles_.push(generated);
    });

    //create index.html file
    const createIndexFile = new CreateIndexFile(
      this.generatedFiles_,
      this.lang_,
      this.outputPath_
    );
    await createIndexFile.createIndexHtmlFile();
  };
}
module.exports.SSG = SSG;
