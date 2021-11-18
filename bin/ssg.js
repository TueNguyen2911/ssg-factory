const { HandleFolder } = require("./helpers/handleFolder");
const { ConvertToHtml } = require("./helpers/convertToHtml");
const { HandleInputPath } = require("./helpers/handleInputPath");
const { WriteHtml } = require("./helpers/writeHtml");
const { CreateIndex } = require("./helpers/createIndex");

/**
 * SSG class takes in all the command line options and generate html files
 */
class SSG {
  constructor(inputPath, outputPath, lang) {
    this.inputPath_ = inputPath;
    this.outputPath_ = outputPath ? outputPath : "./dist";
    this.lang_ = lang ? lang : "en-CA";
  }
  createFileInfo = () => {
    return new Promise((resolve) => {
      let promiseArr = [];
      let fileInfo = [];

      const handleInput = new HandleInputPath("textfiles");
      handleInput.handleInput();
      const initalData = handleInput.getData();
      //if extension is folder, get the resolve of the inital Promise return (an array of file paths in the folder)
      //for each file => handleInput() again => resolve the Promise return and get the file data.
      if (initalData.ext == "folder") {
        initalData.result.then((paths) => {
          paths.map((path) => {
            handleInput.setFilePath(path);
            handleInput.handleInput();
            const folderData = handleInput.getData();
            promiseArr.push(folderData.result);
            fileInfo.push({
              path: path,
              fileData: ""
            });
          });
          (async () => {
            const temp = await Promise.all(promiseArr);
            temp.map((fileData, index) => {
              fileInfo[index].fileData = fileData;
            });
            resolve(fileInfo);
          })();
        });
      } else {
        initalData.result((fileData) => {
          fileInfo.push({ path: this.inputPath_, fileData: fileData });
        });
      }
    });
  };
  /**
   * main function of SSG
   */
  generateFile = async () => {
    let promiseArr = [];
    let response = null;
    //delete or create new output folder
    const handleFolder = new HandleFolder(this.outputPath_);
    handleFolder.createFolder();
    //handle input file path, fileInfos is an array of {path, fileData}
    const fileInfo = await this.createFileInfo();

    //convert fileData of files ".txt" and ".md" into htmlString;
    const convertToHtml = new ConvertToHtml(this.lang_, this.outputPath_);
    promiseArr = fileInfo.map((elem) => {
      convertToHtml.setFileData(elem.fileData);
      convertToHtml.setFilePath(elem.path);
      return convertToHtml.convertFileDataToHtml();
    });
    response = await Promise.all(promiseArr);
    const toBeWritten = response.map((converted) => {
      return {
        htmlString: converted.htmlString,
        fullOutputPath: converted.fullOutputPath
      };
    });

    //write html files to output folder
    const writeHtml = new WriteHtml(null, null);
    promiseArr = toBeWritten.map((converted) => {
      writeHtml.setOutputPath(converted.fullOutputPath);
      writeHtml.setHtmlString(converted.htmlString);
      return writeHtml.writeHtmlFileToOutputFolder();
    });
    response = await Promise.all(promiseArr);
    //generatedFiles array
    const generatedFiles = response.map((generated) => generated);

    //create index.html file
    const createIndexFile = new CreateIndex(
      generatedFiles,
      this.lang_,
      this.outputPath_
    );
    await createIndexFile.createIndexHtmlFile();
  };
}
module.exports.SSG = SSG;
