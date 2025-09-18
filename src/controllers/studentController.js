const Student = require('../models/Student');
const { formatResponse, generateStudentId } = require('../utils/helpers');

const createStudent = async (request, reply) => {
  try {
    const studentData = {
      ...request.body,
      studentId: generateStudentId()
    };

    const student = new Student(studentData);
    await student.save();

    const populatedStudent = await Student.findById(student._id)
      .populate('department', 'name code')
      .populate('course', 'courseName courseCode');

    const responseData = populatedStudent.toObject();
    delete responseData.password;

    return reply.status(201).send(
      formatResponse(true, responseData, 'Student created successfully', 201)
    );
  } catch (error) {
    if (error.code === 11000) {
      return reply.status(400).send(
        formatResponse(false, 'Student with this email already exists', 'Bad Request', 400)
      );
    }
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getAllStudents = async (request, reply) => {
  try {
    const { page = 1, limit = 10, department, course, status, search } = request.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (department) filter.department = department;
    if (course) filter.course = course;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(filter)
      .populate('department', 'name code')
      .populate('course', 'courseName courseCode')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filter);

    return reply.send(
      formatResponse(true, {
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalStudents: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }, 'Students retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getStudentById = async (request, reply) => {
  try {
    const { id } = request.params;

    const student = await Student.findById(id)
      .populate('department', 'name code description')
      .populate('course', 'courseName courseCode description')
      .select('-password');

    if (!student) {
      return reply.status(404).send(
        formatResponse(false, 'Student not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, student, 'Student retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const updateStudent = async (request, reply) => {
  try {
    const { id } = request.params;
    const updates = request.body;

    // Remove fields that shouldn't be updated directly
    delete updates.studentId;
    delete updates.password;
    delete updates.email;

    const student = await Student.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('department', 'name code')
    .populate('course', 'courseName courseCode')
    .select('-password');

    if (!student) {
      return reply.status(404).send(
        formatResponse(false, 'Student not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, student, 'Student updated successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const deleteStudent = async (request, reply) => {
  try {
    const { id } = request.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return reply.status(404).send(
        formatResponse(false, 'Student not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, null, 'Student deleted successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getStudentsByDepartment = async (request, reply) => {
  try {
    const { departmentId } = request.params;

    const students = await Student.find({ department: departmentId })
      .populate('course', 'courseName courseCode')
      .select('-password')
      .sort({ firstName: 1 });

    return reply.send(
      formatResponse(true, students, 'Students retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByDepartment
};