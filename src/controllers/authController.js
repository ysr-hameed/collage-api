const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const { generateToken, formatResponse } = require('../utils/helpers');

const loginStudent = async (request, reply) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send(
        formatResponse(false, 'Email and password are required', 'Bad Request', 400)
      );
    }

    const student = await Student.findOne({ email }).select('+password').populate('department course');

    if (!student || !(await student.comparePassword(password))) {
      return reply.status(401).send(
        formatResponse(false, 'Invalid credentials', 'Unauthorized', 401)
      );
    }

    if (student.status !== 'Active') {
      return reply.status(403).send(
        formatResponse(false, 'Account is not active', 'Forbidden', 403)
      );
    }

    const token = generateToken({
      id: student._id,
      userType: 'student'
    });

    const studentData = student.toObject();
    delete studentData.password;

    return reply.send(
      formatResponse(true, {
        user: studentData,
        token,
        userType: 'student'
      }, 'Login successful')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const loginFaculty = async (request, reply) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send(
        formatResponse(false, 'Email and password are required', 'Bad Request', 400)
      );
    }

    const faculty = await Faculty.findOne({ email }).select('+password').populate('department courses');

    if (!faculty || !(await faculty.comparePassword(password))) {
      return reply.status(401).send(
        formatResponse(false, 'Invalid credentials', 'Unauthorized', 401)
      );
    }

    if (faculty.status !== 'Active') {
      return reply.status(403).send(
        formatResponse(false, 'Account is not active', 'Forbidden', 403)
      );
    }

    const token = generateToken({
      id: faculty._id,
      userType: 'faculty'
    });

    const facultyData = faculty.toObject();
    delete facultyData.password;

    return reply.send(
      formatResponse(true, {
        user: facultyData,
        token,
        userType: 'faculty'
      }, 'Login successful')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getProfile = async (request, reply) => {
  try {
    const user = request.user.toObject();
    delete user.password;

    return reply.send(
      formatResponse(true, {
        user,
        userType: request.userType
      }, 'Profile retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const updateProfile = async (request, reply) => {
  try {
    const updates = request.body;
    const userId = request.user._id;
    const userType = request.userType;

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.email;
    delete updates.studentId;
    delete updates.facultyId;

    let updatedUser;
    if (userType === 'student') {
      updatedUser = await Student.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
      ).populate('department course');
    } else {
      updatedUser = await Faculty.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
      ).populate('department courses');
    }

    const userData = updatedUser.toObject();
    delete userData.password;

    return reply.send(
      formatResponse(true, userData, 'Profile updated successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

module.exports = {
  loginStudent,
  loginFaculty,
  getProfile,
  updateProfile
};