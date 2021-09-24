import {getMetainfo, getTableContent} from './methods.js';

const faculty = document.getElementById('faculty');
const department = document.getElementById('department');
const course = document.getElementById('course');
const group = document.getElementById('group');
const date = document.getElementById('date');

const defaultCourses = localStorage.getItem('courses');
const defaultDepartments = localStorage.getItem('departments');
const defaultFaculties = localStorage.getItem('faculties');
const defaultGroups = localStorage.getItem('groups');

const addOption = (arr, datalist) => {
  arr.forEach((item) => {
    const option = document.createElement('option');
    option.id = item.value;
    option.value = item.value;
    option.myID = item.id;

    datalist.appendChild(option);
  });
}

export default async () => {
  try {
    if (defaultCourses && defaultDepartments && defaultFaculties && defaultGroups){
      const tableContent = await getTableContent({
        courses: defaultCourses,
        departments: defaultDepartments,
        faculties: defaultFaculties,
        groups: defaultGroups,
        dates: '20.09.2021 0:00:00',
      })

      console.log(tableContent);
    }

    const { courses, dates, departments, faculties, groups } = await getMetainfo();

    addOption(faculties, faculty);
    addOption(departments, department);
    addOption(courses, course);
    addOption(groups, group);
    addOption(dates, date);

  } catch (e){
    console.error(e);
  }
};
