#!/usr/bin/env node
const { Command } = require("commander");
const program = new Command();
const fs = require("fs");
const { SSG } = require("./ssg");

//configure program
program.version("tue-1st-ssg 0.1", "-v, --version");
program
  .option("-o, --output <path>", "specify a path for .html files output")
  .option("-l, --lang <language code>", "adding a language to HTML document")
  .option(
    "-i, --input <file path>",
    "(required) transform .txt or .md files into .html files"
  )
  .option(
    "-c, --config <config file path>",
    "use stored commands in config file"
  );

const parseCommand = (option) => {
  program.parse(process.argv);

  //Look for option
  if (option.config) {
    try {
      let configData = fs.readFileSync(option.config);
      let configOptions = JSON.parse(configData);
      for (const [key, value] of Object.entries(configOptions)) {
        value || value.length > 0
          ? (option[`${key}`] = `${value}`)
          : (option[`${key}`] = undefined);
      }
      if (!option.input) {
        console.error(
          `error: input <file or directory> is not specified in config file ${option.config}`
        );
        return 0;
      }
    } catch (error) {
      console.error(
        `Can't read or parse config file ${option.config}\n ${error}`
      );
      return 0;
    }
  }
  if (option.output) {
    console.log(`Output path: ${option.output}`);
  }
  if (option.lang) {
    console.log(`Html language: ${option.lang}`);
  }
  if (option.input) {
    console.log(`Input path: ${option.input}`);
    return 1;
  } else {
    console.error(
      "error: required option '-i, --input <file path>' not specified"
    );
    return 0;
  }
};
const convertFiles = (option) => {
  var ssg = new SSG(option.input, option.output, option.lang);
  ssg.processInput(ssg.inputPath_);
};
const option = program.opts();
if (parseCommand(option)) {
  convertFiles(option);
}
module.exports.parseCommand = parseCommand;
