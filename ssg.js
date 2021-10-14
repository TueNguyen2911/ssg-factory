const fs = require('fs');
const htmlCreator = require('html-creator');
const path = require('path');
class SSG {
    filePaths = [];
    constructor(inputPath, outputPath, lang) {
        this.inputPath = inputPath;
        this.outputPath = outputPath ? outputPath : './dist';
        this.lang = lang ? lang : 'en-CA';
    }
    setInputPath(inputPath) {
        this.inputPath = inputPath;
    }
    setOutputPath(outputPath) {
        this.outputPath = outputPath;
    }
    setLang(lang) {
        this.lang = lang;
    }
    /** 
*  Create htmlCreator object using 2 params
*  @param: paragraphObj, an object of {type, content} for <p>, for .md file paragraphObj is body object containing more than <p>, <a>
*  @return: an object of type htmlCreator, can use htmlRender() to convert to string
*/
    createHtml = (paragraphObj, titleObj) => {
        const html = new htmlCreator().withBoilerplate();
        var bodyContent = [{
            type: 'div',
            attributes: { className: 'paragraphObj' },
            content: paragraphObj
        }]
        // if a title is found, add the title wrapped inside `<h1>`
        // tag to the top of the `<body>` HTML element
        if (titleObj.content) {
            bodyContent.unshift({
                type: 'h1',
                content: titleObj.content,
            });
        }
        if (paragraphObj == null) {
            bodyContent.pop();
        }
        html.document.setTitle(titleObj.content ? `${titleObj.content}` : "Article")
        // Append link to stylesheet to the `<head>` HTML element
        html.document.addElementToType("head", {
            type: "link",
            attributes: {
                rel: "stylesheet",
                href: "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
            },
        });
        html.document.addElementToType('body', bodyContent);
        return html;
    }
    /**
       * writeHTMLFiles takes in 2 parameters fullOutputPath, fileToHTMLCreator, it convert fileToHTMLCreator to string first and then write
       * the file to the fullOutputPath
       * @param {*} fullOutPutPath the output path + filename + file extension
       * @param {*} fileToHtmlCreator the htmlCreator object created from the input file
       */
    writeHTMLFile = (fullOutputPath, fileToHtmlCreator) => {
        fs.writeFile(
            fullOutputPath,
            fileToHtmlCreator
                .renderHTML()
                .replace(/<html>/, `<html lang="${this.lang}">`),
            (err) => {
                if (err)
                    return errorToConsole(`Unable to create file ${fullOutputPath}`);
                else console.log("\x1b[36m", `${fullOutputPath} is created`, "\x1b[0m");
            }
        );
    };
    /** 
    *  Look for title and convert text files into html files
    *  @param: filePath from commandLine
    */
    createHTMLFile = (filePath, fileType) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err)
                return console.error(`Unable to read file ${filePath}`, err);
            let titleObj = new Object({ type: 'title', content: null });
            //check for title, regEx checks if a line is followed by 2 newline \n\n\n
            if (data.match(/^.+(\r?\n\r?\n\r?\n)/)) {
                titleObj.content = data.match(/^.+(\r?\n\r?\n\r?\n)/)[0].match(/(\w+)/g).join(" ");
            }
            let count = 0;
            const bodyObj = data
                .substr(titleObj.content ? titleObj.content.length : 0)
                .split(/\r?\n\r?\n/)
                .map(param => {
                    if (fileType == "md") {
                        if (param.match(/^\s*#{1,6}[^#]+$/) && count == 0) {
                            titleObj['content'] = param.replace(/^\s*#{1,6}([^#]+)$/, "$1").trim();
                            count++;
                        }
                        return markdownToHtml(param);
                    } else {
                        return Object({ type: 'p', content: param });
                    }
                });

            const fileToHtmlCreator = this.createHtml(bodyObj, titleObj);
            const fullOutputPath = path.join(this.outputPath, `${path.basename(filePath, fileType)}.html`)
            this.writeHTMLFile(fullOutputPath, fileToHtmlCreator);
        });
        this.filePaths.push(path.basename(filePath));
    }
    /**
     * markdownToHtml parse the string 'param' using regExs
     * @param {*} param string split by 2 newline characters delimiter
     * @returns an Object of {type: "", content: ""} to be injected into HTMLCreator object
     */
    markdownToHtml = (param) => {
        // If Heading 1 to 6, turn into corresponding h1 to h6 tag
        if (param.match(/^\s*#{1,6}[^#]+$/)) {
            const headerNum = param.match(/#/g).length
            return Object({ type: `h${headerNum}`, content: param.replace(/^\s*#{1,6}([^#]+)$/, "$1") });
        }
        else {
            // Wrap bold text inside <b></b>
            param = param.replace(/\*\*([^\*]+)\*\*/g, "<b>$1</b>")
            param = param.replace(/__([^\*]+)__/g, "<b>$1</b>")

            // Wrap italic text inside <i></i>
            param = param.replace(/\*([^\*]+)\*/g, "<i>$1</i>")
            param = param.replace(/_([^\*]+)_/g, "<i>$1</i>")
            //Wrap code inside <code>
            param = param.replace(/\`([^\`].+?)\`/g, "<code>$1</code>");
            param = param.replace(/(```([^`].+?)```)/gms, "<code>$2</code>")

            // Turn link: [Title](http://example.com) into: <a href="http://example.com">Title</a>
            param = param.replace(/\[(.+)\]\((.+)\)/, '<a href="$2">$1</a>')

            if (param.match(/\[(.+)\]\((.+)\)/))
                return Object({ type: 'a', attributes: { href: param.match(/\[(.+)\]\((.+)\)/)[2] }, content: param.match(/\[(.+)\]\((.+)\)/)[1] });
            if (param.match(/---/))
                return Object({ type: 'hr', content: null });
            return Object({ type: 'p', content: param });
        }
    }

    /**
     * readInput takes in 'filePath', it checks if parameter is a file (call createHTMLFile) or directory (recursive until it's got a file)
     * @param {*} filePath input path from command
     */
    readInput = (filePath) => {
        const stat = fs.lstatSync(filePath);
        if (!stat.isFile() && stat.isDirectory()) {
            fs.readdirSync(filePath).forEach((inDir) => {
                //recursive until a .txt or .md file is recognized
                this.readInput(`${filePath}/${inDir}`);
            })
        }
        else if (stat.isFile() && path.extname(filePath) == ".txt") {
            this.createHTMLFile(filePath, ".txt");
        }
        else if (stat.isFile() && path.extname(filePath) == ".md") {
            this.createHTMLFile(filePath, ".md");
        }
    }

    /**
     *  processInput processes input <filepath> and creates index.html
     *  @param {*} filePath input path from command
     */
    processInput = (filepath) => {
        if (!fs.existsSync(this.outputPath))
            fs.mkdirSync(this.outputPath);
        //delete previous html files in the output folder after generating new html files
        fs.readdirSync(this.outputPath).forEach(file => {
            const outputFolderFile = `${this.outputPath}/${file}`
            if (this.filePaths.indexOf(outputFolderFile) < 0 && outputFolderFile.split('.').pop() == "html") {
                fs.unlink(outputFolderFile, (err) => {
                    if (err)
                        console.error(err);
                })
            }
        });
        //creating index.html linking all html files
        this.readInput(filepath);
        const linkObj = this.filePaths.map(param => {
            return {
                type: 'a',
                //replace white space with %20
                attributes: { href: `${param.match(/([^\/]+$)/g)[0].split('.')[0].replace(/\s/g, '%20')}.html`, style: 'display: block' },
                content: `${param.match(/([^\/]+$)/g)[0].split('.')[0]}`
            }
        });
        const indexHtmlCreator = this.createHtml(linkObj, { type: 'title', content: 'Index' });
        const indexOutputPath = path.join(this.outputPath, "index.html");
        this.writeHTMLFile(indexOutputPath, indexHtmlCreator);
    }
}
module.exports.SSG = SSG;