const { loginStudent, loginFaculty, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

async function authRoutes(fastify, options) {
  // Student login
  fastify.post('/student/login', {
    schema: {
      tags: ['Auth'],
      description: 'Student login',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                token: { type: 'string' },
                userType: { type: 'string' }
              }
            },
            timestamp: { type: 'string' },
            statusCode: { type: 'number' }
          }
        }
      }
    }
  }, loginStudent);

  // Faculty login
  fastify.post('/faculty/login', {
    schema: {
      tags: ['Auth'],
      description: 'Faculty login',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                token: { type: 'string' },
                userType: { type: 'string' }
              }
            },
            timestamp: { type: 'string' },
            statusCode: { type: 'number' }
          }
        }
      }
    }
  }, loginFaculty);

  // Get profile (protected route)
  fastify.get('/profile', {
    preHandler: [authenticate],
    schema: {
      tags: ['Auth'],
      description: 'Get user profile',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            timestamp: { type: 'string' },
            statusCode: { type: 'number' }
          }
        }
      }
    }
  }, getProfile);

  // Update profile (protected route)
  fastify.put('/profile', {
    preHandler: [authenticate],
    schema: {
      tags: ['Auth'],
      description: 'Update user profile',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              pincode: { type: 'string' }
            }
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            timestamp: { type: 'string' },
            statusCode: { type: 'number' }
          }
        }
      }
    }
  }, updateProfile);
}

module.exports = authRoutes;