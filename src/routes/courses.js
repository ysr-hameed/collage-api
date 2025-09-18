const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');

async function courseRoutes(fastify, options) {
  // Create course (Faculty only)
  fastify.post('/', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Courses'],
      description: 'Create a new course',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['courseName', 'department', 'credits', 'duration', 'type', 'semester', 'maxStudents', 'fee', 'startDate'],
        properties: {
          courseCode: { type: 'string', maxLength: 10 },
          courseName: { type: 'string', maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          department: { type: 'string' },
          credits: { type: 'number', minimum: 1, maximum: 10 },
          duration: { type: 'number', minimum: 1, maximum: 6 },
          type: { type: 'string', enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate'] },
          semester: { type: 'number', minimum: 1, maximum: 8 },
          maxStudents: { type: 'number', minimum: 1 },
          fee: { type: 'number', minimum: 0 },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          prerequisites: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, createCourse);

  // Get all courses
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      tags: ['Courses'],
      description: 'Get all courses with pagination and filters',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          department: { type: 'string' },
          type: { type: 'string', enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate'] },
          search: { type: 'string' }
        }
      }
    }
  }, getAllCourses);

  // Get course by ID
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Courses'],
      description: 'Get course by ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, getCourseById);

  // Update course
  fastify.put('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Courses'],
      description: 'Update course information',
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
          courseName: { type: 'string', maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          credits: { type: 'number', minimum: 1, maximum: 10 },
          maxStudents: { type: 'number', minimum: 1 },
          fee: { type: 'number', minimum: 0 },
          endDate: { type: 'string', format: 'date' },
          prerequisites: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, updateCourse);

  // Delete course (soft delete)
  fastify.delete('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Courses'],
      description: 'Deactivate course',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, deleteCourse);
}

module.exports = courseRoutes;