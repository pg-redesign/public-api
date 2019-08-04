const Student = require("../../student");

const studentInfo = {
  firstName: "Vamp",
  lastName: "Hallow",
  email: "vamp@hallow.com",
  company: "Vampiire Codes",
};

const studentLocation = {
  city: "Salem",
  state: "MA",
  country: "USA",
};

// formatted with location
const studentData = {
  ...studentInfo,
  location: studentLocation,
};

// unformatted location
const studentRegistrationData = {
  ...studentInfo,
  ...studentLocation,
};

const createStudent = (data = studentData) => Student.query().insert(data);

const destroyStudent = studentId => Student.query().deleteById(studentId);

const destroyAllStudents = () => Student.query().del();

module.exports = {
  studentData,
  studentRegistrationData,
  createStudent,
  destroyStudent,
  destroyAllStudents,
};
