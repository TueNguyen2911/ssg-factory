const runSSG = require("./runSSG"); 

describe("End to End testing", () => {
    test("should print usage and options when --help option is specified", async () => {
        const { stderr, stdout, exitCode} = await runSSG("--help");

        expect(stdout).toMatchSnapshot();
        expect(stderr).toEqual("");    
    });
    // test("should print inuput path and file converting result when --input is specified", async () => {
    //     const { stderr, stdout, exitCode } = await runSSG("--input", "./bin/test/samples");

    //     expect(stdout).toMatchSnapshot();
    //     expect(stderr).toEqual("");    
    // });
    test("should print the version of the program when --version is specified", async () => {
        const { stderr, stdout, exitCode } = await runSSG("--version");

        expect(stdout).toMatchSnapshot();
        expect(stderr).toEqual("");    
    });
    // test("should print the input/output path and result when --config is specified", async () => {
    //     const { stderr, stdout, exitCode } = await runSSG("--config", "./bin/test/config.json");

    //     expect(stdout).toMatchSnapshot();
    //     expect(stderr).toEqual("");    
    // });
})