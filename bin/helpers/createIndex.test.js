const { CreateIndex } = require("./createIndex");
const path = require("path");
describe("Testing CreateIndexFile class", () => {
  test("createIndexHtmlFile() should return a resolve message", async () => {
    const toBeGenerated = ["file.txt", "text.txt", "README.md"];
    const lang = "en-CA";
    const outputFolder = "./build";
    const output = `${path.join(outputFolder, "Index.html")} is created`;
    const createIndex = new CreateIndex(toBeGenerated, lang, outputFolder);
    expect(await createIndex.createIndexHtmlFile()).toEqual(output);
  });
});
