const puppeteer = require("puppeteer")
const fse = require("fs-extra")
const hbs = require("handlebars")
const path = require("path")
require("dotenv").config();


const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'views/layouts', `${templateName}.hbs`);
    const html = await fse.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

hbs.registerHelper('assetPath', function (value) {
    let host = process.env.URL_APP;
    console.log(host)
    return `${host}/assets/${value}`
})

const generate = async (outputFileName, data) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('main', data)

        await page.setContent(content);
        await page.emulateMediaType('screen')
        await page.pdf({
            path: `output/${outputFileName}.pdf`,
            format: 'letter',
            printBackground: true
        });

        await browser.close()
        return {success: true, error: null}
    } catch (e) {
        return {success: true, error: e}
    }
}

module.exports = {
    generate
}