const Course = require('../models/Course');
const Department = require('../models/Department');
const { formatResponse, generateCourseCode } = require('../utils/helpers');

const createCourse = async (request, reply) => {
  try {
    const courseData = request.body;
    
    // Generate course code if not provided
    if (!courseData.courseCode) {
      const department = await Department.findById(courseData.department);
      courseData.courseCode = generateCourseCode(department.code, courseData.courseName);
    }

    const course = new Course(courseData);
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('department', 'name code')
      .populate('faculty', 'firstName lastName email');

    return reply.status(201).send(
      formatResponse(true, populatedCourse, 'Course created successfully', 201)
    );
  } catch (error) {
    if (error.code === 11000) {
      return reply.status(400).send(
        formatResponse(false, 'Course with this code already exists', 'Bad Request', 400)
      );
    }
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getAllCourses = async (request, reply) => {
  try {
    const { page = 1, limit = 10, department, type, search } = request.query;
    const skip = (page - 1) * limit;

    let filter = { isActive: true };
    if (department) filter.department = department;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { courseName: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('department', 'name code')
      .populate('faculty', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(filter);

    return reply.send(
      formatResponse(true, {
        courses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCourses: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }, 'Courses retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getCourseById = async (request, reply) => {
  try {
    const { id } = request.params;

    const course = await Course.findById(id)
      .populate('department', 'name code description')
      .populate('faculty', 'firstName lastName email designation')
      .populate('students');

    if (!course) {
      return reply.status(404).send(
        formatResponse(false, 'Course not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, course, 'Course retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const updateCourse = async (request, reply) => {
  try {
    const { id } = request.params;
    const updates = request.body;

    const course = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('department', 'name code')
    .populate('faculty', 'firstName lastName');

    if (!course) {
      return reply.status(404).send(
        formatResponse(false, 'Course not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, course, 'Course updated successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const deleteCourse = async (request, reply) => {
  try {
    const { id } = request.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return reply.status(404).send(
        formatResponse(false, 'Course not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, null, 'Course deactivated successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};