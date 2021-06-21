const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 3000;
const URL = "http://rsp.iseu.by/Raspisanie/TimeTable/umu.aspx";

app.get("/", (req, res) => {
  res.send({
    message: `How you can use it?
              : Choose your group
              : Choose your course
              : Choose your department`,
  });
});

function getOptionsFromSelect(cheerio, selector) {
  return cheerio(selector)[0]
    .children.filter((elem) => elem.name === "option")
    .map((elem) => ({
      id: elem.attribs.value,
      value: elem.children[0].data.trim(),
    }));
}

function setObjectProperties(elem, className) {
  return elem.children
    .find((el) => el.attribs?.class.includes(className))
    ?.children[0]?.data.trim();
}

function isRowWithScheduleInfo(elem) {
  return (
    elem.name === "tr" &&
    (elem.attribs.class === "row" || elem.attribs.class === "row row-spanned")
  );
}

async function selectValueFromDropdown(page, selector, value) {
  await page.select(selector, value);
  await page.waitForNavigation();
}

const FACULTY_SELECTOR = "#ddlFac";
const DEPARTMENT_SELECTOR = "#ddlDep";
const COURSE_SELECTOR = "#ddlCourse";
const GROUP_SELECTOR = "#ddlGroup";
const DATE_SELECTOR = "#ddlWeek";

/**
 * URL params
 * @param {faculty}
 * @param {department}
 * @param {course}
 * @param {group}
 */
app.get("/metainfo", async (req, res) => {
  const { faculty, department, course, group } = req.query;
  console.log(faculty, department, course, group);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(URL);

  if (faculty) {
    // TODO: sequence?
    await page.select(FACULTY_SELECTOR, faculty);
    await page.waitForNavigation();
  }

  const html = await page.evaluate(() => document.querySelector("*").outerHTML);
  const $ = cheerio.load(html);

  const faculties = getOptionsFromSelect($, FACULTY_SELECTOR);
  const departments = getOptionsFromSelect($, DEPARTMENT_SELECTOR);
  const courses = getOptionsFromSelect($, COURSE_SELECTOR);
  const groups = getOptionsFromSelect($, GROUP_SELECTOR);
  const dates = getOptionsFromSelect($, DATE_SELECTOR);

  await browser.close();

  res.send({ faculties, departments, groups, dates, courses });
});

/**
 * URL params (al of them are required)
 * @param {faculty}
 * @param {department}
 * @param {course}
 * @param {group}
 * @param {date}
 */
app.get("/schedule", async (req, res) => {
  const { faculty, department, course, group, date } = req.query;
  console.log(faculty, department, course, group, date);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(URL);

  await selectValueFromDropdown(page, FACULTY_SELECTOR, faculty);
  await selectValueFromDropdown(page, COURSE_SELECTOR, course);
  await selectValueFromDropdown(page, DEPARTMENT_SELECTOR, department);
  await selectValueFromDropdown(page, GROUP_SELECTOR, group);
  await selectValueFromDropdown(page, DATE_SELECTOR, date);
  await page.click('[class="chosen-single button"]');
  await page.evaluateOnNewDocument();

  const html = await page.evaluate(() => document.querySelector("*").outerHTML);
  const $ = cheerio.load(html);
  const table = $("#TT");
  let day;

  const schedule = table[0].children[2].children
    .filter(isRowWithScheduleInfo)
    .map((elem) => ({
      date: (day =
        elem.attribs.class === "row row-spanned"
          ? elem.children
              .find((el) => el.attribs?.class.includes("cell-date"))
              ?.children[0]?.children[0]?.data.trim()
          : day),

      time: setObjectProperties(elem, "cell-time"),
      subgroup: setObjectProperties(elem, "cell-subgroup"),
      discipline: setObjectProperties(elem, "cell-discipline"),
      teacher: setObjectProperties(elem, "cell-staff"),
      room: setObjectProperties(elem, "cell-auditory"),
    }));

  res.send(schedule);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
