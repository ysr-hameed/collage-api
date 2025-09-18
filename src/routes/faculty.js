const {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
  getFacultyByDepartment
} = require('../controllers/facultyController');
const { authenticate, authorize } = require('../middleware/auth');

async function facultyRoutes(fastify, options) {
  // Create faculty (Faculty only - for admin faculty)
  fastify.post('/', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Faculty'],
      description: 'Create a new faculty member',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password', 'phone', 'dateOfBirth', 'gender', 'department', 'qualification', 'specialization', 'experience', 'designation', 'salary'],
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
          qualification: { type: 'string', enum: ['PhD', 'Masters', 'Bachelors', 'Diploma'] },
          specialization: { type: 'string' },
          experience: { type: 'number', minimum: 0 },
          designation: { type: 'string', enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'HOD'] },
          salary: { type: 'number', minimum: 0 },
          courses: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, createFaculty);

  // Get all faculty
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      tags: ['Faculty'],
      description: 'Get all faculty with pagination and filters',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          department: { type: 'string' },
          designation: { type: 'string', enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'HOD'] },
          status: { type: 'string', enum: ['Active', 'Inactive', 'On Leave', 'Retired'] },
          search: { type: 'string' }
        }
      }
    }
  }, getAllFaculty);

  // Get faculty by ID
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Faculty'],
      description: 'Get faculty by ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, getFacultyById);

  // Update faculty
  fastify.put('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Faculty'],
      description: 'Update faculty information',
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
          specialization: { type: 'string' },
          experience: { type: 'number', minimum: 0 },
          designation: { type: 'string', enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'HOD'] },
          salary: { type: 'number', minimum: 0 },
          status: { type: 'string', enum: ['Active', 'Inactive', 'On Leave', 'Retired'] },
          courses: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, updateFaculty);

  // Delete faculty
  fastify.delete('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Faculty'],
      description: 'Delete faculty',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, deleteFaculty);

  // Get faculty by department
  fastify.get('/department/:departmentId', {
    preHandler: [authenticate],
    schema: {
      tags: ['Faculty'],
      description: 'Get faculty by department',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          departmentId: { type: 'string' }
        },
        required: ['departmentId']
      }
    }
  }, getFacultyByDepartment);
}

module.exports = facultyRoutes;