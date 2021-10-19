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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    const page = await browser.newPage();

    // // Помогает фильтровать и получать только HTML игнорируя CSS and JS
    // // await page.setRequestInterception(true);
    // // page.on('request', (request) => {
    // //   if (request.resourceType() === 'document') {
    // //     request.continue();
    // //   } else {
    // //     request.abort();
    // //   }
    // // });
    //
    await page.goto(constants.URL);

    await selectValueFromDropdown(page, constants.FACULTY_SELECTOR, req.data.faculties);
    await selectValueFromDropdown(page, constants.DEPARTMENT_SELECTOR, req.data.departments);
    await selectValueFromDropdown(page, constants.COURSE_SELECTOR, req.data.courses);
    await selectValueFromDropdown(page, constants.GROUP_SELECTOR, req.data.groups);
    await selectValueFromDropdown(page, constants.DATE_SELECTOR, req.data.dates);

    await page.click('[class="chosen-single button"]');
    // await page.evaluateOnNewDocument(undefined, undefined);
    await new Promise((resolve) => setTimeout(resolve, 5000));

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

    // res.send([{
    //   dayOfWeek: 'Понедельник',
    //   dayOfMonth: '27.09.2021',
    //   schedule: [
    //     {
    //       time: {
    //         beginsAt: '11:05',
    //         endsAt: '12:25',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '307',
    //       },
    //       subgroup: '1 п/гр',
    //       discipline: 'Основы защиты информации',
    //       teacher: 'ст.пр. Николаенко Екатерина Анатольевна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '12:55',
    //         endsAt: '14:15',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '307',
    //       },
    //       subgroup: '1 п/гр',
    //       discipline: 'Основы защиты информации',
    //       teacher: 'ст.пр. Николаенко Екатерина Анатольевна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '14:25',
    //         endsAt: '15:45',
    //       },
    //       place: {
    //         build: '',
    //         room: '',
    //       },
    //       discipline: 'Физическая культура',
    //       teacher: '',
    //     },
    //     {
    //       time: {
    //         beginsAt: '15:55',
    //         endsAt: '17:15',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '22,',
    //       },
    //       discipline: 'Безопасность жизнедеятельности человека',
    //       teacher: 'проф. Герменчук Мария Григорьевна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '17:25',
    //         endsAt: '18:45',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '22,',
    //       },
    //       discipline: 'Базы данных',
    //       teacher: 'доц. Иванюкович Владимир Александрович',
    //     },
    //   ],
    // },
    // {
    //   dayOfWeek: 'Вторник',
    //   dayOfMonth: '28.09.2021',
    //   schedule: [
    //     {
    //       time: {
    //         beginsAt: '08:30',
    //         endsAt: '09:50',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '407',
    //       },
    //       discipline: 'Электроника и автоматизация. Автоматизация измерений',
    //       teacher: 'доц. Липницкий Леонид Александрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '10:05',
    //         endsAt: '11:25',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '407',
    //       },
    //       discipline: 'Экологическая социология',
    //       teacher: 'ст.пр. Короткевич Анна Вячеславовна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '11:35',
    //         endsAt: '12:55',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '313',
    //       },
    //       subgroup: '1 п/гр',
    //       discipline: 'Объектно-ориентированное программирование',
    //       teacher: 'ст.пр. Куканков Григорий Петрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '13:25',
    //         endsAt: '14:45',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '313',
    //       },
    //       subgroup: '1 п/гр',
    //       discipline: 'Объектно-ориентированное программирование',
    //       teacher: 'ст.пр. Куканков Григорий Петрович',
    //     },
    //   ],
    // },
    // {
    //   dayOfWeek: 'Среда',
    //   dayOfMonth: '29.09.2021',
    //   schedule: [
    //     {
    //       time: {
    //         beginsAt: '09:35',
    //         endsAt: '10:55',
    //       },
    //       place: {
    //         build: '',
    //         room: '',
    //       },
    //       discipline: 'Физическая культура',
    //       teacher: '',
    //     },
    //     {
    //       time: {
    //         beginsAt: '11:05',
    //         endsAt: '12:25',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '407',
    //       },
    //       discipline: 'Иностранный язык',
    //       teacher: 'пр. Буткевич Юлия Игоревна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '11:05',
    //         endsAt: '12:25',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '310',
    //       },
    //       discipline: 'Иностранный язык',
    //       teacher: 'пр. Жегало Татьяна Ивановна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '11:35',
    //         endsAt: '12:55',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '410',
    //       },
    //       discipline: 'Иностранный язык',
    //       teacher: 'ст.пр. Беляева Татьяна-Светлана Валериевна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '13:25',
    //         endsAt: '14:45',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '103',
    //       },
    //       discipline: 'Объектно-ориентированное программирование',
    //       teacher: 'ст.пр. Куканков Григорий Петрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '14:55',
    //         endsAt: '16:15',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '311',
    //       },
    //       subgroup: '2 п/гр',
    //       discipline: 'Базы данных',
    //       teacher: 'ст.пр. Николаенко Екатерина Анатольевна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '16:25',
    //         endsAt: '17:45',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '311',
    //       },
    //       subgroup: '2 п/гр',
    //       discipline: 'Базы данных',
    //       teacher: 'ст.пр. Николаенко Екатерина Анатольевна',
    //     },
    //   ],
    // },
    // {
    //   dayOfWeek: 'Четверг',
    //   dayOfMonth: '30.09.2021',
    //   schedule: [
    //     {
    //       time: {
    //         beginsAt: '14:25',
    //         endsAt: '15:45',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '417',
    //       },
    //       discipline: 'Диагностика и лечение заболеваний',
    //       teacher: 'проф. Царев Владимир Петрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '15:55',
    //         endsAt: '17:15',
    //       },
    //       place: {
    //         build: 'К1',
    //         room: '417',
    //       },
    //       discipline: 'Диагностика и лечение заболеваний',
    //       teacher: 'проф. Царев Владимир Петрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '17:55',
    //         endsAt: '19:15',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '311',
    //       },
    //       subgroup: '1 п/гр',
    //       discipline: 'Базы данных',
    //       teacher: 'доц. Иванюкович Владимир Александрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '19:25',
    //         endsAt: '20:45',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '311',
    //       },
    //       subgroup: '1 п/гр',
    //       discipline: 'Базы данных',
    //       teacher: 'доц. Иванюкович Владимир Александрович',
    //     },
    //   ],
    // },
    // {
    //   dayOfWeek: 'Пятница',
    //   dayOfMonth: '01.10.2021',
    //   schedule: [
    //     {
    //       time: {
    //         beginsAt: '11:35',
    //         endsAt: '12:55',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '203',
    //       },
    //       discipline: 'Электроника и автоматизация. Автоматизация измерений',
    //       teacher: 'доц. Липницкий Леонид Александрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '13:25',
    //         endsAt: '14:45',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '203',
    //       },
    //       discipline: 'Электроника и автоматизация. Автоматизация измерений',
    //       teacher: 'доц. Липницкий Леонид Александрович',
    //     },
    //     {
    //       time: {
    //         beginsAt: '14:55',
    //         endsAt: '16:15',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '410',
    //       },
    //       discipline: 'Иностранный язык',
    //       teacher: 'пр. Жегало Татьяна Ивановна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '14:55',
    //         endsAt: '16:15',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '301',
    //       },
    //       discipline: 'Иностранный язык',
    //       teacher: 'пр. Буткевич Юлия Игоревна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '14:55',
    //         endsAt: '16:15',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '205',
    //       },
    //       discipline: 'Иностранный язык',
    //       teacher: 'ст.пр. Беляева Татьяна-Светлана Валериевна',
    //     },
    //     {
    //       time: {
    //         beginsAt: '16:25',
    //         endsAt: '17:45',
    //       },
    //       place: {
    //         build: 'К2',
    //         room: '211',
    //       },
    //       discipline: 'Основы защиты информации',
    //       teacher: 'ст.пр. Николаенко Екатерина Анатольевна',
    //     },
    //   ],
    // }]);

    if (true) {
      console.log('\n', '=====================================');
      console.table(req.data);
      console.timeEnd('Response time');
      console.log('=====================================', '\n');
    } else { throw new Error('puppeteer not working'); }
  } catch (e) {
    console.error(e);
  }
};
