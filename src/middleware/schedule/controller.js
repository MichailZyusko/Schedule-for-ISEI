import puppeteer from "puppeteer";
import cheerio from "cheerio";
import constants from '../../constants.js'

function setObjectProperties(elem, className) {
  return elem.children
    .find((el) => el.attribs.class.includes(className))
    .children[0].data.trim();
}

function isRowWithScheduleInfo(elem) {
  return (
    elem.attribs.class === 'row' || elem.attribs.class === 'row row-spanned'
  );
}

async function selectValueFromDropdown(page, selector, value) {
  await page.select(selector, value);
  await page.waitForNavigation();
}

export default async (req, res, next) => {
  const {
    faculties, departments, courses, groups, dates,
  } = req.body;
  console.log('================================');
  console.log(
    'Faculty:',
    faculties,
    '\nDepartment:',
    departments,
    '\nCourse:',
    courses,
    '\nGroup:',
    groups,
    '\nDate:',
    dates,
  );

  const start = new Date();

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(constants.URL);

  await selectValueFromDropdown(page, constants.FACULTY_SELECTOR, faculties);
  await selectValueFromDropdown(page, constants.COURSE_SELECTOR, courses);
  await selectValueFromDropdown(page, constants.DEPARTMENT_SELECTOR, departments);
  await selectValueFromDropdown(page, constants.GROUP_SELECTOR, groups);
  await selectValueFromDropdown(page, constants.DATE_SELECTOR, dates);
  await page.click('[class="chosen-single button"]', {
    waitUntil: 'domcontentloaded',
  });
  // await page.evaluateOnNewDocument();
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  const html = await page.evaluate(() => document.querySelector('*').outerHTML);
  const $ = cheerio.load(html);
  const table = $('#TT > tbody > tr');

  let dayOfWeek;
  let dayOfMonth;

  // const schedule = Array.from(table)
  //   .filter(isRowWithScheduleInfo)
  //   .map((elem) => ({
  //     DayOfWeek: (dayOfWeek = elem.attribs.class === 'row row-spanned'
  //       ? elem.children
  //         .find((el) => el.attribs?.class.includes('cell-date'))
  //         .children[0].children[0].data.trim()
  //       : dayOfWeek),
  //     DayOfMonth: (dayOfMonth = elem.attribs.class === 'row row-spanned'
  //       ? elem.children
  //         .find((el) => el.attribs.class.includes('cell-date'))
  //         .children[2].children[0].data.trim()
  //       : dayOfMonth),
  //     Time: setObjectProperties(elem, 'cell-time'),
  //     Subgroup: setObjectProperties(elem, 'cell-subgroup'),
  //     Discipline: setObjectProperties(elem, 'cell-discipline'),
  //     Teacher: setObjectProperties(elem, 'cell-staff'),
  //     Room: setObjectProperties(elem, 'cell-auditory'),
  //   }));
  const schedule = Array.from(table)
    .filter(isRowWithScheduleInfo)
    .map((elem) => ({
      DayOfWeek: (dayOfWeek =
        elem.attribs.class === "row row-spanned"
          ? elem.children
            .find((el) => el.attribs?.class.includes("cell-date"))
            ?.children[0]?.children[0]?.data.trim()
          : dayOfWeek),
      DayOfMonth: (dayOfMonth =
        elem.attribs.class === "row row-spanned"
          ? elem.children
            .find((el) => el.attribs?.class.includes("cell-date"))
            ?.children[2]?.children[0]?.data.trim()
          : dayOfMonth),
      Time: setObjectProperties(elem, "cell-time"),
      Subgroup: setObjectProperties(elem, "cell-subgroup"),
      Discipline: setObjectProperties(elem, "cell-discipline"),
      Teacher: setObjectProperties(elem, "cell-staff"),
      Room: setObjectProperties(elem, "cell-auditory"),
    }));

  await browser.close();

  res.send(schedule);

  console.log('Time:', new Date() - start);
  console.log('================================');
}