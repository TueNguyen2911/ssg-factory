const { ConvertToHtml } = require("../bin/helpers/convertToHtml");

describe("Testing convertFileDataToHtml()", () => {
  test("paragraphs should be wrapped in <p> tag", async () => {
    const convertToHtml = new ConvertToHtml("en", "./dist");

    convertToHtml.setFilePath("./samples/test.txt");
    convertToHtml.setFileData("Hello World");

    const result = await convertToHtml.convertFileDataToHtml();
    expect(result.htmlString).toMatch(new RegExp(/<p>(.+?)<\/p>/g));
  });

  test("paragraphs should be wrapped in <p> tag", async () => {
    const convertToHtml = new ConvertToHtml("en", "./dist");

    convertToHtml.setFilePath("./samples/test.txt");
    convertToHtml.setFileData(`A title\n\n\nThis is a paragraph.`);

    const result = await convertToHtml.convertFileDataToHtml();
    expect(result.htmlString).toMatch(new RegExp(/<h1>(.+?)<\/h1>\n/g));
  });
});
