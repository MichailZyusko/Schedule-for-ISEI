import validator from 'validator';

class DTO {
  constructor({
    query: {
      faculty, department, course,
    },
  }) {
    this.faculty = faculty;
    this.department = department;
    this.course = course;
  }
}

const isValid = ({ faculty, department, course }) => validator.isInt(faculty)
  && validator.isInt(department)
  && validator.isInt(course);

export default async (req, res, next) => {
  try {
    const {
      faculty, department, course,
    } = new DTO(req);

    if (!(faculty && department && course)) {
      throw new Error('Bad request');
      // throw new ApiError(400, 'Bad request');
    }

    if (!isValid({ faculty, department, course })) {
      throw new Error('Bad request');
      // throw new ApiError(400, 'Not valid form data');
    }

    req.data = {
      faculty, department, course,
    };
    next();
  } catch (error) {
    next(error);
  }
};
