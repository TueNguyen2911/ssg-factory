const { SSG } = require("../ssg");

jest.mock("fs");
var fs = require("fs").promises;

describe("Testing readInput()", () => {
  //since we're using lStatSync, don't know how to mock => will add later
});
describe("Testing createHTMLFile() with '.txt' file", () => {
  const filename = "file.txt";
  const ext = ".txt";
  const fileData = `THE ADVENTURE OF THE SIX NAPOLEONS


  It was no very unusual thing for Mr. Lestrade in upon us
  going on at the police`;
  beforeAll(() => {
    fs.__setMockFileData(`${filename}`, fileData);
  });

  test("'txt' file", async () => {
    ssg = new SSG(null, null, null);
    const res = await ssg.createHTMLFile(filename, ext);
    expect(ssg.toBeGenerated_.length).toEqual(1);
    expect(ssg.toBeGenerated_[0].html).toEqual('<!DOCTYPE html>\n        <html lang="en-CA">\n          <head>\n            <meta charset="utf-8" />\n            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />\n            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css" />\n            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">\n            <title>THE ADVENTURE OF THE SIX NAPOLEONS</title>\n          </head>\n          <body>\n            <main>\n              <div class="mainContent">\n                <h1>THE ADVENTURE OF THE SIX NAPOLEONS</h1>\n<p>  It was no very unusual thing for Mr. Lestrade in upon us   going on at the police</p>\n              </div>\n            </main>\n          </body>\n        </html>');
  });

});
describe("Testing createHTMLFile() with '.md' file", () => {
  const filename = "file.md";
  const ext = ".md";
  const fileData = `# Javascript Static Site Generator (SSG)

  A Javascript command line program that converts **.txt** and **.md** files into **.html** files.`;
  beforeAll(() => {
    fs.__setMockFileData(`${filename}`, fileData);
  });

  test("'.md' file", async () => {
    ssg = new SSG(null, null, null);
    const res = await ssg.createHTMLFile(filename, ext);
    expect(ssg.toBeGenerated_.length).toEqual(1);
    expect(ssg.toBeGenerated_[0].html).toEqual('<!DOCTYPE html>\n        <html lang="en-CA">\n          <head>\n            <meta charset="utf-8" />\n            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />\n            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css" />\n            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">\n            <title>Javascript Static Site Generator (SSG)</title>\n          </head>\n          <body>\n            <main>\n              <div class="mainContent">\n                <h1>Javascript Static Site Generator (SSG)</h1>\n<p>A Javascript command line program that converts <strong>.txt</strong> and <strong>.md</strong> files into <strong>.html</strong> files.</p>\n\n              </div>\n            </main>\n          </body>\n        </html>');
  });
});
