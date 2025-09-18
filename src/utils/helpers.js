const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const generateStudentId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `STU${year}${random}`;
};

const generateFacultyId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FAC${year}${random}`;
};

const generateCourseCode = (departmentCode, courseName) => {
  const nameCode = courseName.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${departmentCode}${nameCode}${random}`;
};

const formatResponse = (success, data, message, statusCode = 200) => {
  return {
    success,
    message,
    data: success ? data : undefined,
    error: !success ? data : undefined,
    timestamp: new Date().toISOString(),
    statusCode
  };
};

module.exports = {
  generateToken,
  validateEmail,
  validatePhone,
  generateStudentId,
  generateFacultyId,
  generateCourseCode,
  formatResponse
};