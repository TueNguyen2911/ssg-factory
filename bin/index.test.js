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
    return output.join("");
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
    const error =
      "error: required option '-i, --input <file path>' not specified";
    const option = {};
    const boolean = parseCommand(option);
    expect(finalize(logOutput)).toBe(null);
    expect(finalize(errorOutput)).toEqual(error);
    expect(boolean).toBe(0);
  });
  test("Input file path is specified", () => {
    const expected = "Input path: ./files";
    const option = {
      input: "./files"
    };
    parseCommand(option);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });

  test("Output file path is specified", () => {
    const expected_output = "Output path: ./build";
    const expected = "Input path: ./files";
    const option = {
      input: "./files",
      output: "./build"
    };
    parseCommand(option);
    expect(finalize(logOutput)).toEqual(expected_output.concat(expected));
    expect(finalize(errorOutput)).toBe(null);
  });

  test("Html language is specified", () => {
    const expected_lang = "Html language: en-CA";
    const expected = "Input path: ./files";
    const option = {
      input: "./files",
      lang: "en-CA"
    };
    parseCommand(option);
    expect(finalize(logOutput)).toEqual(expected_lang.concat(expected));
    expect(finalize(errorOutput)).toBe(null);
  });
});
