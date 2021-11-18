const { CreateIndex } = require("./createIndex");
const path = require("path");
const pretty = require("pretty");
describe("Testing CreateIndexFile class", () => {
  test("createHtmlString() should return a html string", async () => {
    const toBeGenerated = ["file.txt", "text.txt", "README.md"];
    const lang = "en-CA";
    const outputFolder = "./build";
    const createIndex = new CreateIndex(toBeGenerated, lang, outputFolder);
    const output = `<!DOCTYPE html>
    <html lang=\"en-CA\">
      <head>
        <meta charset=\"utf-8\" />
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\" />
        <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/water.css@2/out/water.css\" />
        <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css\">
        <title>Index</title>
      </head>
      <body>
        <main>
          <div class=\"mainContent\">
            <h1>Index</h1>
            <a style=\"display:block\" href=file.txt>file.txt</a>
            <a style=\"display:block\" href=text.txt>text.txt</a>
            <a style=\"display:block\" href=README.md>README.md</a>
            
          </div>
        </main>
      </body>
    </html>`;

    expect(createIndex.createHtmlString(createIndex.createLinks())).toBe(
      pretty(output)
    );
  });
});
