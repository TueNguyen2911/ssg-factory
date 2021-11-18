const { HandleInputPath } = require("./handleInputPath");

jest.mock("fs");
const fs = require("fs").promises;

describe("Testing handleInputPath class", () => {
  const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
  let handleInput = null;

  test("should throw error if handleInput() tries to check for invalid filePath extension", () => {
    ["test.doc", "pic.mp4", "video.mp4"].map((filePath) => {
      handleInput = new HandleInputPath(filePath);
      handleInput.handleInput();
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });

  test("handleInput() should return a Promise and a file ext if file path is valid", async () => {
    const filePath = "file.txt";
    fs.__setMockFileData(filePath, "It's a piece of text");
    handleInput = new HandleInputPath(filePath);
    handleInput.handleInput();
    const data = handleInput.getData();
    expect(typeof data.ext).toEqual("string");
    expect(typeof data.result).toEqual("object");
  });

  test("handleInput() should return the correct data", async () => {
    const filePath = "file.txt";
    fs.__setMockFileData(filePath, "It's a piece of text");
    handleInput = new HandleInputPath(filePath);
    handleInput.handleInput();
    const data = handleInput.getData();
    expect(data.ext).toEqual(".txt");
    expect(await data.result).toEqual("It's a piece of text");
  });
});
