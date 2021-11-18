const fs = require("fs");

class HandleFolder {
  constructor(outputFolder) {
    this.outputFolder_ = outputFolder;
  }

  createFolder = () => {
    if (fs.existsSync(this.outputFolder_)) {
      this.removeFolder();
    }
    // create new dir
    fs.mkdirSync(this.outputFolder_);
  };

  getPath() {
    return this.path;
  }

  removeFolder = () => {
    fs.rmSync(this.outputFolder_, { recursive: true });
  };
}
module.exports.HandleFolder = HandleFolder;
