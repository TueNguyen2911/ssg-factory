const { Command } = require('commander');
const program = new Command();
const fs = require('fs');
const {SSG} = require('./ssg');

//configure program
program.version('tue-1st-ssg 0.1', '-v, --version');
program 
  .option('-o, --output <path>', 'specify a path for .html files output')
  .option('-l, --lang <language code>', 'adding a language to HTML document')
  .option('-i, --input <file path>', '(required) transform .txt or .md files into .html files')
  .option('-c, --config <config file path>', 'use stored commands in config file');

program.parse(process.argv)

//Look for option
const option = program.opts();

if(option.config){
  try {
    let configData = fs.readFileSync(option.config);
    let configOptions = JSON.parse(configData); 
    for(const [key, value] of Object.entries(configOptions)) {
      value || value.length > 0 ? option[`${key}`] = `${value}` : option[`${key}`] = undefined;
    }
    if(!option.input) {
      console.error('\x1B[31m', `error: input <file or directory> is not specified in config file ${option.config}`, '\x1B[0m');
      process.exit(-1);
    }
  } catch(error) {
  console.error('\x1B[31m', `Can't read or parse config file ${option.config}\n ${error}`, '\x1B[0m');
  process.exit(-1);
  }
}
if(option.input) {
  var ssg = new SSG(option.input, option.output, option.lang);
  ssg.processInput(option.input);
}
else
  console.error('\x1B[31m', `error: required option '-i, --input <file path>' not specified`, '\x1B[0m');
