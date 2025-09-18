const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByDepartment
} = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

async function studentRoutes(fastify, options) {
  // Create student (Faculty only)
  fastify.post('/', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Students'],
      description: 'Create a new student',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password', 'phone', 'dateOfBirth', 'gender', 'department', 'course', 'semester'],
        properties: {
          firstName: { type: 'string', maxLength: 50 },
          lastName: { type: 'string', maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          phone: { type: 'string', pattern: '^[0-9]{10}$' },
          dateOfBirth: { type: 'string', format: 'date' },
          gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              pincode: { type: 'string', pattern: '^[0-9]{6}$' }
            }
          },
          department: { type: 'string' },
          course: { type: 'string' },
          semester: { type: 'number', minimum: 1, maximum: 8 },
          guardian: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              relationship: { type: 'string' },
              phone: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      }
    }
  }, createStudent);

  // Get all students
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      tags: ['Students'],
      description: 'Get all students with pagination and filters',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          department: { type: 'string' },
          course: { type: 'string' },
          status: { type: 'string', enum: ['Active', 'Inactive', 'Graduated', 'Dropped'] },
          search: { type: 'string' }
        }
      }
    }
  }, getAllStudents);

  // Get student by ID
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Students'],
      description: 'Get student by ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, getStudentById);

  // Update student
  fastify.put('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Students'],
      description: 'Update student information',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string', maxLength: 50 },
          lastName: { type: 'string', maxLength: 50 },
          phone: { type: 'string', pattern: '^[0-9]{10}$' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              pincode: { type: 'string', pattern: '^[0-9]{6}$' }
            }
          },
          semester: { type: 'number', minimum: 1, maximum: 8 },
          status: { type: 'string', enum: ['Active', 'Inactive', 'Graduated', 'Dropped'] },
          guardian: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              relationship: { type: 'string' },
              phone: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      }
    }
  }, updateStudent);

  // Delete student
  fastify.delete('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Students'],
      description: 'Delete student',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, deleteStudent);

  // Get students by department
  fastify.get('/department/:departmentId', {
    preHandler: [authenticate],
    schema: {
      tags: ['Students'],
      description: 'Get students by department',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          departmentId: { type: 'string' }
        },
        required: ['departmentId']
      }
    }
  }, getStudentsByDepartment);
}

module.exports = studentRoutes;