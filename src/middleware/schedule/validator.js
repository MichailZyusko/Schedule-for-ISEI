import validator from 'validator';
import dateFormatter from './helper/dateFormater.js';

class DTO {
  constructor({
    query: {
      faculties, departments, courses, groups, dates,
    },
  }) {
    this.faculties = faculties;
    this.departments = departments;
    this.courses = courses;
    this.groups = groups;
    this.dates = dateFormatter(dates.split('-W'));
  }
}

const isValid = ({
  faculties, departments, courses, groups, dates,
}) => validator.isInt(faculties)
  && validator.isInt(departments)
  && validator.isInt(courses)
  && validator.isInt(groups)
  && !validator.isEmpty(dates);

export default async (req, res, next) => {
  try {
    const {
      faculties, departments, courses, groups, dates,
    } = new DTO(req);

    if (!(faculties && departments && courses && groups && dates)) {
      throw new Error('Bad request');
      // throw new ApiError(400, 'Bad request');
    }

    if (!isValid({
      faculties, departments, courses, groups, dates,
    })) {
      throw new Error('Bad request');
      // throw new ApiError(400, 'Not valid form data');
    }

    req.data = {
      faculties, departments, courses, groups, dates,
    };
    next();
  } catch (error) {
    next(error);
  }
};
