const Department = require('../models/Department');
const { formatResponse } = require('../utils/helpers');

const createDepartment = async (request, reply) => {
  try {
    const department = new Department(request.body);
    await department.save();

    const populatedDepartment = await Department.findById(department._id)
      .populate('head', 'firstName lastName email designation');

    return reply.status(201).send(
      formatResponse(true, populatedDepartment, 'Department created successfully', 201)
    );
  } catch (error) {
    if (error.code === 11000) {
      return reply.status(400).send(
        formatResponse(false, 'Department with this name or code already exists', 'Bad Request', 400)
      );
    }
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getAllDepartments = async (request, reply) => {
  try {
    const { page = 1, limit = 10, search, isActive } = request.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const departments = await Department.find(filter)
      .populate('head', 'firstName lastName email designation')
      .populate('facultyCount')
      .populate('studentCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Department.countDocuments(filter);

    return reply.send(
      formatResponse(true, {
        departments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalDepartments: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }, 'Departments retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getDepartmentById = async (request, reply) => {
  try {
    const { id } = request.params;

    const department = await Department.findById(id)
      .populate('head', 'firstName lastName email designation')
      .populate('facultyCount')
      .populate('studentCount');

    if (!department) {
      return reply.status(404).send(
        formatResponse(false, 'Department not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, department, 'Department retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const updateDepartment = async (request, reply) => {
  try {
    const { id } = request.params;
    const updates = request.body;

    const department = await Department.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('head', 'firstName lastName email designation');

    if (!department) {
      return reply.status(404).send(
        formatResponse(false, 'Department not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, department, 'Department updated successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const deleteDepartment = async (request, reply) => {
  try {
    const { id } = request.params;

    const department = await Department.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!department) {
      return reply.status(404).send(
        formatResponse(false, 'Department not found', 'Not Found', 404)
      );
    }

    return reply.send(
      formatResponse(true, null, 'Department deactivated successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

const getDepartmentStats = async (request, reply) => {
  try {
    const { id } = request.params;

    const department = await Department.findById(id)
      .populate('facultyCount')
      .populate('studentCount');

    if (!department) {
      return reply.status(404).send(
        formatResponse(false, 'Department not found', 'Not Found', 404)
      );
    }

    // Get additional statistics
    const Faculty = require('../models/Faculty');
    const Student = require('../models/Student');
    const Course = require('../models/Course');

    const [facultyByDesignation, studentsBySemester, activeCourses] = await Promise.all([
      Faculty.aggregate([
        { $match: { department: department._id } },
        { $group: { _id: '$designation', count: { $sum: 1 } } }
      ]),
      Student.aggregate([
        { $match: { department: department._id } },
        { $group: { _id: '$semester', count: { $sum: 1 } } }
      ]),
      Course.countDocuments({ department: department._id, isActive: true })
    ]);

    const stats = {
      department: department.name,
      totalFaculty: department.facultyCount,
      totalStudents: department.studentCount,
      activeCourses,
      facultyByDesignation,
      studentsBySemester
    };

    return reply.send(
      formatResponse(true, stats, 'Department statistics retrieved successfully')
    );
  } catch (error) {
    return reply.status(500).send(
      formatResponse(false, error.message, 'Internal Server Error', 500)
    );
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats
};