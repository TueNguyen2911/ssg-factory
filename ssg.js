const fs = require('fs');
const htmlCreator = require('html-creator');
class SSG {
    filePaths = [];
    constructor() {
        this.inputPath = null
        this.outputPath = null;
        this.lang = null;
    }
    constructor(inputPath, outputPath, lang) {
        this.inputPath = inputPath; 
        this.outputPath = outputPath; 
        this.lang = lang
    }
    setInputPath(inputPath) {
        this.inputPath = inputPath; 
    }
    setOutputPath(outputPath) {
        this.outputPath = outputPath; 
    }
    setLang(lang) {
        this.lang = lang;
    }
}