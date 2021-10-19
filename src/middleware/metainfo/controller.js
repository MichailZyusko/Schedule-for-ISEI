import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import constants from '../../constants.js';
import selectValueFromDropdown from '../schedule/helper/selectValueFromDropdown.js';
import getOptionsFromSelect from './helper/getOptionsFromSelect.js';

export default async (req, res) => {
  console.time('Response time');
  console.table(req.data);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(constants.URL);

  await selectValueFromDropdown(page, constants.FACULTY_SELECTOR, req.data.faculty);
  await selectValueFromDropdown(page, constants.DEPARTMENT_SELECTOR, req.data.department);
  await selectValueFromDropdown(page, constants.COURSE_SELECTOR, req.data.course);

  const html = await page.evaluate(() => document.querySelector('*').outerHTML);
  const $ = cheerio.load(html);

  const faculties = getOptionsFromSelect($, constants.FACULTY_SELECTOR);
  const departments = getOptionsFromSelect($, constants.DEPARTMENT_SELECTOR);
  const courses = getOptionsFromSelect($, constants.COURSE_SELECTOR);
  const groups = getOptionsFromSelect($, constants.GROUP_SELECTOR);

  res.send({
    faculties,
    departments,
    groups,
    courses,
  });

  await browser.close();

  console.log('\n', '=====================================');
  console.table(req.data);
  console.timeEnd('Response time');
  console.log('=====================================', '\n');
};
