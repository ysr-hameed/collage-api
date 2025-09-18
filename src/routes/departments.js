const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats
} = require('../controllers/departmentController');
const { authenticate, authorize } = require('../middleware/auth');

async function departmentRoutes(fastify, options) {
  // Create department (Faculty only)
  fastify.post('/', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Departments'],
      description: 'Create a new department',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'code'],
        properties: {
          name: { type: 'string' },
          code: { type: 'string', maxLength: 10 },
          description: { type: 'string' },
          head: { type: 'string' },
          established: { type: 'string', format: 'date' }
        }
      }
    }
  }, createDepartment);

  // Get all departments
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      tags: ['Departments'],
      description: 'Get all departments with pagination and filters',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          search: { type: 'string' },
          isActive: { type: 'string', enum: ['true', 'false'] }
        }
      }
    }
  }, getAllDepartments);

  // Get department by ID
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Departments'],
      description: 'Get department by ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, getDepartmentById);

  // Update department
  fastify.put('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Departments'],
      description: 'Update department information',
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
          name: { type: 'string' },
          code: { type: 'string', maxLength: 10 },
          description: { type: 'string' },
          head: { type: 'string' },
          isActive: { type: 'boolean' }
        }
      }
    }
  }, updateDepartment);

  // Delete department (soft delete)
  fastify.delete('/:id', {
    preHandler: [authenticate, authorize('faculty')],
    schema: {
      tags: ['Departments'],
      description: 'Deactivate department',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, deleteDepartment);

  // Get department statistics
  fastify.get('/:id/stats', {
    preHandler: [authenticate],
    schema: {
      tags: ['Departments'],
      description: 'Get department statistics',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, getDepartmentStats);
}

module.exports = departmentRoutes;