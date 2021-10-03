import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import constants from '../../constants.js';

function getOptionsFromSelect(cheerio, selector) {
  return cheerio(selector)[0]
    .children.filter((elem) => elem.name === 'option')
    .map((elem) => ({
      id: elem.attribs.value,
      value: elem.children[0].data.trim(),
    }));
}

export default async (req, res, next) => {
  const { faculty, department, course } = req.query;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox, '--disable-setuid-sandbox'"],
    ignoreDefaultArgs: ['--disable-extensions'],
  });
  const page = await browser.newPage();
  await page.goto(constants.URL);

  if (faculty && department && course) {
    await page.select(constants.FACULTY_SELECTOR, faculty);
    await page.waitForNavigation();
    await page.select(constants.DEPARTMENT_SELECTOR, department);
    await page.waitForNavigation();
    await page.select(constants.COURSE_SELECTOR, course);
    await page.waitForNavigation();

    const html = await page.evaluate(() => document.querySelector('*').outerHTML);
    const $ = cheerio.load(html);

    const faculties = getOptionsFromSelect($, constants.FACULTY_SELECTOR);
    const departments = getOptionsFromSelect($, constants.DEPARTMENT_SELECTOR);
    const courses = getOptionsFromSelect($, constants.COURSE_SELECTOR);
    const groups = getOptionsFromSelect($, constants.GROUP_SELECTOR);
    const dates = getOptionsFromSelect($, constants.DATE_SELECTOR);

    await page.close();

    res.send({
      faculties,
      departments,
      groups,
      dates,
      courses,
    });
  } else {
    res.send({
      code: 400,
      message: 'Bad request',
    });
  }
};
