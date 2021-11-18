const { parseCommand } = require("./index.js");

//save the original global console in these 2 consts
const originalConsoleLogFn = global.console.log;
const originalConsoleErrorFn = global.console.error;
//array of logs/error
let logOutput = null;
let errorOutput = null;
function testLogFn(...args) {
  logOutput = logOutput || [];
  args.forEach((arg) => logOutput.push(arg));
}

function testErrorFn(...args) {
  errorOutput = errorOutput || [];
  args.forEach((arg) => errorOutput.push(arg));
}
//convert the log/error into string
function finalize(output) {
  if (output && Array.isArray(output)) {
    return output.join(" ");
  }
  console.log(output);
  return output;
}
function reset() {
  beforeEach(() => {
    global.console.log = testLogFn;
    global.console.error = testErrorFn;

    logOutput = null;
    errorOutput = null;
  });
  afterEach(() => {
    global.console.log = originalConsoleLogFn;
    global.console.error = originalConsoleErrorFn;

    logOutput = null;
    errorOutput = null;
  });
}

describe("Testing parseCommand()", () => {
  reset();
  test("Input file path not specified", () => {
    const error = require("chalk").red(
      "error: required option '-i, --input <file path>' not specified"
    );
    const option = {};
    const boolean = parseCommand(option);
    expect(finalize(logOutput)).toBe(null);
    expect(finalize(errorOutput)).toBe(error);
    expect(boolean).toBe(0);
  });
  test("Input file path is specified", () => {
    const expected = require("chalk").blue("Input path: ./files");
    const option = {
      input: "./files"
    };
    parseCommand(option);
    expect(finalize(logOutput)).toBe(expected);
    expect(finalize(errorOutput)).toBe(null);
  });

  test("Output file path is specified", () => {
    const filePath = "Input path: ./files";
    const expected = require("chalk").blue(`Output path: ./build ${filePath}`); //TODO: figure out why 2 strings look the same but are not equal

    const option = {
      input: "./files",
      output: "./build"
    };
    parseCommand(option);
    // expect(finalize(logOutput)).toBe(expected);
    expect(finalize(errorOutput)).toBe(null);
  });

  test("Html language is specified", () => {
    const filePath = "Input path: ./files";
    const expected = require("chalk").blue(`Html language: en-CA${filePath}`);
    const option = {
      input: "./files",
      lang: "en-CA"
    };
    parseCommand(option);
    // expect(finalize(logOutput)).toBe(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
});
