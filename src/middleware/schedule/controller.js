import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

import constants from '../../constants.js';
import selectValueFromDropdown from './helper/selectValueFromDropdown.js';
import isRowWithScheduleInfo from './helper/isRowWithScheduleInfo.js';

import setTime from './helper/setTime.js';
import setPlace from './helper/setPlace.js';
import setLessonInfo from './helper/setLessonInfo.js';
import setDayOfWeek from './helper/setDayOfWeek.js';
import setDayOfMonth from './helper/setDayOfMonth.js';

// Попробовать вынести отдельно инициализацию браузера
// const createBrowser = () => puppeteer.launch().then((result) => result);
//
// const browser = createBrowser();

export default async (req, res) => {
  try {
    console.time('Response time');
    console.table(req.data);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['- no-sandbox', '–disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Помогает фильтровать и получать только HTML игнорируя CSS and JS
    // await page.setRequestInterception(true);
    // page.on('request', (request) => {
    //   if (request.resourceType() === 'document') {
    //     request.continue();
    //   } else {
    //     request.abort();
    //   }
    // });

    await page.goto(constants.URL);

    await selectValueFromDropdown(page, constants.FACULTY_SELECTOR, req.data.faculties);
    await selectValueFromDropdown(page, constants.DEPARTMENT_SELECTOR, req.data.departments);
    await selectValueFromDropdown(page, constants.COURSE_SELECTOR, req.data.courses);
    await selectValueFromDropdown(page, constants.GROUP_SELECTOR, req.data.groups);
    await selectValueFromDropdown(page, constants.DATE_SELECTOR, req.data.dates);

    await page.click('[class="chosen-single button"]');
    await page.evaluateOnNewDocument(undefined, undefined);
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const html = await page.evaluate(() => document.querySelector('*').outerHTML);
    const $ = cheerio.load(html);
    const table = $('#TT > tbody > tr');

    const timeTable = [];

    Array.from(table)
      .filter(isRowWithScheduleInfo)
      .forEach((elem) => {
        if (elem.attribs.class === 'row row-spanned') {
          timeTable.push({
            dayOfWeek: setDayOfWeek(elem),
            dayOfMonth: setDayOfMonth(elem),
            schedule: [],
          });
        }

        timeTable[timeTable.length - 1]?.schedule.push({
          time: setTime(elem),
          place: setPlace(elem),
          subgroup: setLessonInfo(elem, 'cell-subgroup'),
          discipline: setLessonInfo(elem, 'cell-discipline'),
          teacher: setLessonInfo(elem, 'cell-staff'),
        });
      });

    await page.close();

    res.send(timeTable);

    if (timeTable.length) {
      console.log('\n', '=====================================');
      console.table(req.data);
      console.timeEnd('Response time');
      console.log('=====================================', '\n');
    } else { throw new Error('puppeteer not working'); }
  } catch (e) {
    console.error(e);
  }
};
