require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const connectDB = require('./src/config/database');
const seedData = require('./src/utils/seedData');

// Connect to database and seed if needed
const initDatabase = async () => {
  const connection = await connectDB();
  
  // Only seed if we have a successful database connection
  if (connection && process.env.NODE_ENV !== 'production') {
    // Add a small delay to ensure connection is fully established
    setTimeout(async () => {
      try {
        await seedData();
      } catch (error) {
        console.log('Seeding skipped:', error.message);
      }
    }, 2000);
  }
};

initDatabase();

// Register plugins
const registerPlugins = async () => {
  // CORS support
  await fastify.register(require('@fastify/cors'), {
    origin: true,
    credentials: true
  });

  // Security headers
  await fastify.register(require('@fastify/helmet'));

  // Rate limiting
  await fastify.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute'
  });

  // Swagger documentation
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Collage API',
        description: 'REST API for college management system for tier 3 cities',
        version: '1.0.0'
      },
      host: `localhost:${process.env.PORT || 3000}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      },
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Auth', description: 'Authentication related endpoints' },
        { name: 'Students', description: 'Student management endpoints' },
        { name: 'Courses', description: 'Course management endpoints' },
        { name: 'Faculty', description: 'Faculty management endpoints' },
        { name: 'Departments', description: 'Department management endpoints' }
      ]
    }
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  });
};

// Register routes
const registerRoutes = async () => {
  // Health check
  fastify.get('/health', {
    schema: {
      tags: ['Health'],
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  });

  // API Routes
  await fastify.register(require('./src/routes/auth'), { prefix: '/api/v1/auth' });
  await fastify.register(require('./src/routes/students'), { prefix: '/api/v1/students' });
  await fastify.register(require('./src/routes/courses'), { prefix: '/api/v1/courses' });
  await fastify.register(require('./src/routes/faculty'), { prefix: '/api/v1/faculty' });
  await fastify.register(require('./src/routes/departments'), { prefix: '/api/v1/departments' });
};

// Start server
const start = async () => {
  try {
    await registerPlugins();
    await registerRoutes();
    
    const address = await fastify.listen({
      port: process.env.PORT || 3000,
      host: process.env.HOST || '0.0.0.0'
    });
    
    console.log(`Server is running at ${address}`);
    console.log(`API Documentation available at ${address}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();