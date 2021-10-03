import { getMetainfo, getTableContent } from './methods.js';

const faculty = document.getElementById('faculty');
const department = document.getElementById('department');
const course = document.getElementById('course');
const group = document.getElementById('group');
const date = document.getElementById('date');
const body = document.getElementById('body');
const spinner = document.getElementById('spinner');
const carouselInner = document.getElementById('carouselInner');
const frame = document.getElementById('frame');

const defaultCourses = localStorage.getItem('courses');
const defaultDepartments = localStorage.getItem('departments');
const defaultFaculties = localStorage.getItem('faculties');
const defaultGroups = localStorage.getItem('groups');

const addOption = (arr, datalist) => {
  arr.forEach((item) => {
    const option = document.createElement('option');
    option.id = item.value;
    option.value = item.value;
    option.innerText = item.value;
    option.myID = item.id;

    datalist.appendChild(option);
  });
};

const createBubble = (obj) => {
  const bubel = document.createElement('div');
  bubel.className = 'bubel';

  const time = document.createElement('div');
  time.className = 'time';

  const beginsAt = document.createElement('div');
  beginsAt.innerText = obj.time.beginsAt;

  const endsAt = document.createElement('div');
  endsAt.innerText = obj.time.endsAt;

  time.appendChild(beginsAt);
  time.appendChild(endsAt);

  const leftVl = document.createElement('div');
  leftVl.className = 'vl';

  const lesson = document.createElement('div');
  lesson.className = 'lesson';
  lesson.innerText = obj.discipline;

  const rightVl = document.createElement('div');
  rightVl.className = 'vl';

  const place = document.createElement('div');
  place.className = 'place';

  const room = document.createElement('div');
  room.innerText = obj.place.room;

  const build = document.createElement('div');
  build.innerText = obj.place.build;

  place.appendChild(room);
  place.appendChild(build);

  bubel.appendChild(time);
  bubel.appendChild(leftVl);
  bubel.appendChild(lesson);
  bubel.appendChild(rightVl);
  bubel.appendChild(place);

  return bubel;
};

const fillFrame = (carousel, day) => {
  const dateContainer = document.createElement('div');
  const dayOfWeek = document.createElement('div');
  const dayOfMonth = document.createElement('div');

  dateContainer.className = 'date';
  dayOfWeek.className = 'day-of-week';
  dayOfMonth.className = 'day-of-month';

  dayOfMonth.innerText = day.dayOfMonth;
  dayOfWeek.innerText = day.dayOfWeek;

  dateContainer.appendChild(dayOfWeek);
  dateContainer.appendChild(dayOfMonth);
  carousel.appendChild(dateContainer);

  const schedule = document.createElement('div');
  schedule.className = 'schedule';

  day.schedule.forEach((item) => schedule.appendChild(createBubble(item)));
  carousel.appendChild(schedule);
};

const createCarousel = (schedule) => {
  // const carouselSlide = document.createElement('div');
  // carouselSlide.id = 'carouselExampleControls';
  // carouselSlide.className = 'carousel slide';
  // carouselSlide['data-bs-ride'] = 'carousel';
  //
  // const carouselInner = document.createElement('div');
  // carouselInner.className = 'carousel-inner';

  const carouselInnerActive = document.createElement('div');
  carouselInnerActive.className = 'carousel-item active';
  fillFrame(carouselInnerActive, schedule[0]);
  carouselInner.appendChild(carouselInnerActive);

  for (let i = 1; i < schedule.length; i += 1) {
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';
    fillFrame(carouselItem, schedule[i]);
    carouselInner.appendChild(carouselItem);
  }

  // const carouselControlPrev = document.createElement('button');
  // carouselControlPrev.className = 'carousel-control-prev';
  // carouselControlPrev.type = 'button';
  // carouselControlPrev['data-bs-target'] = '#carouselExampleControls';
  // carouselControlPrev['data-bs-slide'] = 'prev';
  //
  // const carouselControlPrevIcon = document.createElement('span');
  // carouselControlPrevIcon.className = 'carousel-control-prev-icon';
  // carouselControlPrevIcon['aria-hidden'] = 'true';
  //
  // const visuallyHiddenPrevious = document.createElement('span');
  // visuallyHiddenPrevious.className = 'visually-hidden';
  // visuallyHiddenPrevious.innerText = 'Previous';
  //
  // carouselControlPrev.appendChild(carouselControlPrevIcon);
  // carouselControlPrev.appendChild(visuallyHiddenPrevious);
  //
  // const carouselControlNext = document.createElement('button');
  // carouselControlNext.className = 'carousel-control-next';
  // carouselControlNext.type = 'button';
  // carouselControlNext['data-bs-target'] = '#carouselExampleControls';
  // carouselControlNext['data-bs-slide'] = 'next';
  //
  // const carouselControlNextIcon = document.createElement('span');
  // carouselControlNextIcon.className = 'carousel-control-next-icon';
  // carouselControlNextIcon['aria-hidden'] = 'true';
  //
  // const visuallyHiddenNext = document.createElement('span');
  // visuallyHiddenNext.className = 'visually-hidden';
  // visuallyHiddenNext.innerText = 'Next';
  //
  // carouselControlNext.appendChild(carouselControlNextIcon);
  // carouselControlNext.appendChild(visuallyHiddenNext);
  //
  // carouselSlide.appendChild(carouselInner);
  // carouselSlide.appendChild(carouselControlPrev);
  // carouselSlide.appendChild(carouselControlNext);

  // frame.appendChild(carouselSlide);
};

// <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
//   <div className="carousel-inner">
//     <div className="carousel-item active">
//       <img src="..." className="d-block w-100" alt="...">
//     </div>
//     <div className="carousel-item">
//       <img src="..." className="d-block w-100" alt="...">
//     </div>
//     <div className="carousel-item">
//       <img src="..." className="d-block w-100" alt="...">
//     </div>
//   </div>
//   <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
//     <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//     <span className="visually-hidden">Previous</span>
//   </button>
//   <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
//     <span className="carousel-control-next-icon" aria-hidden="true"></span>
//     <span className="visually-hidden">Next</span>
//   </button>
// </div>

const createFrame = (schedule) => {
  // const frame = document.createElement('div');
  // frame.className = 'frame';

  createCarousel(schedule);

  // body.appendChild(frame);
};

export default async () => {
  try {
    if (defaultCourses && defaultDepartments && defaultFaculties && defaultGroups) {
      const schedule = await getTableContent({
        courses: defaultCourses,
        departments: defaultDepartments,
        faculties: defaultFaculties,
        groups: defaultGroups,
        dates: '2021-W39',
      });

      console.log(schedule);

      createFrame(schedule);

      spinner.style.display = 'none';
      frame.style.display = 'flex';
    }

    const {
      courses, dates, departments, faculties, groups,
    } = await getMetainfo();

    addOption(faculties, faculty);
    addOption(departments, department);
    addOption(courses, course);
    addOption(groups, group);
    addOption(dates, date);
  } catch (e) {
    console.error(e);
  }
};
