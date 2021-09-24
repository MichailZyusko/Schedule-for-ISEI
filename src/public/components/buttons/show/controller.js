import getTableContent from './methods.js';

const inputFaculty = document.getElementById('inputFaculty');
const inputDepartment = document.getElementById('inputDepartment');
const inputCourse = document.getElementById('inputCourse');
const inputGroup = document.getElementById('inputGroup');
const inputDate = document.getElementById('inputDate')

export default async () => {
  try {

    const confirmed = confirm('Хотите сохранить заданные параметры по умолчанию?');

    const courseID = document.getElementById(inputCourse.value).myID;
    const departmentID = document.getElementById(inputDepartment.value).myID;
    const facultyID = document.getElementById(inputFaculty.value).myID;
    const groupID = document.getElementById(inputGroup.value).myID;
    const dateID = document.getElementById(inputDate.value).myID;

    if (confirmed){
      localStorage.setItem('courses', courseID);
      localStorage.setItem('departments', departmentID);
      localStorage.setItem('faculties', facultyID);
      localStorage.setItem('groups', groupID);
    }

    const tableContent = await getTableContent({
      courses: courseID,
      departments: departmentID,
      faculties: facultyID,
      groups: groupID,
      dates: dateID,
    });

    console.log(tableContent);

  } catch (e){
    console.error(e);
  }
};
