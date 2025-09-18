const Faculty = require('../models/Faculty');
const { formatResponse, generateFacultyId } = require('../utils/helpers');

const createFaculty = async (request, reply) => {
  try {
    const facultyData = {
      ...request.body,
      facultyId: generateFacultyId()
    };

    const faculty = new Faculty(facultyData);
    await faculty.save();

    const populatedFaculty = await Faculty.findById(faculty._id)
      .populate('department', 'name code')
      .populate('courses', 'courseName courseCode');

    const responseData = populatedFaculty.toObject();
    delete responseData.password;

    return reply.status(201).send(
      formatResponse(true, responseData, 'Faculty created successfully', 201)
    );
  } catch (error) {
    if (error.code === 11000) {
      return reply.status(400).send(
        formatResponse(false, 'Faculty with this email already exists', 'Bad Request', 400)
      );
    }
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getAllFaculty = async (request, reply) => {
  try {
    const { page = 1, limit = 10, department, designation, status, search } = request.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { facultyId: { $regex: search, $options: 'i' } }
      ];
    }

    const faculty = await Faculty.find(filter)
      .populate('department', 'name code')
      .populate('courses', 'courseName courseCode')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Faculty.countDocuments(filter);

    return reply.send(
      formatResponse(true, {
        faculty,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalFaculty: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }, 'Faculty retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getFacultyById = async (request, reply) => {
  try {
    const { id } = request.params;

    const faculty = await Faculty.findById(id)
      .populate('department', 'name code description')
      .populate('courses', 'courseName courseCode description')
      .select('-password');

    if (!faculty) {
      return reply.status(404).send(
        formatResponse(false, 'Faculty not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, faculty, 'Faculty retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const updateFaculty = async (request, reply) => {
  try {
    const { id } = request.params;
    const updates = request.body;

    // Remove fields that shouldn't be updated directly
    delete updates.facultyId;
    delete updates.password;
    delete updates.email;

    const faculty = await Faculty.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('department', 'name code')
    .populate('courses', 'courseName courseCode')
    .select('-password');

    if (!faculty) {
      return reply.status(404).send(
        formatResponse(false, 'Faculty not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, faculty, 'Faculty updated successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const deleteFaculty = async (request, reply) => {
  try {
    const { id } = request.params;

    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      return reply.status(404).send(
        formatResponse(false, 'Faculty not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, null, 'Faculty deleted successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getFacultyByDepartment = async (request, reply) => {
  try {
    const { departmentId } = request.params;

    const faculty = await Faculty.find({ department: departmentId })
      .populate('courses', 'courseName courseCode')
      .select('-password')
      .sort({ firstName: 1 });

    return reply.send(
      formatResponse(true, faculty, 'Faculty retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
  getFacultyByDepartment
};