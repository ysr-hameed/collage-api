const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(401).send({
        success: false,
        error: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.userType === 'student') {
      user = await Student.findById(decoded.id).populate('department course');
    } else if (decoded.userType === 'faculty') {
      user = await Faculty.findById(decoded.id).populate('department courses');
    }

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid token'
      });
    }

    request.user = user;
    request.userType = decoded.userType;
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid token'
    });
  }
};

const authorize = (...roles) => {
  return async (request, reply) => {
    if (!roles.includes(request.userType)) {
      return reply.status(403).send({
        success: false,
        error: 'Access denied. Insufficient permissions.'
      });
    }
  };
};

module.exports = { authenticate, authorize };