const express = require('express');
const app = express();
const connectMongo = require('./mongodb');
const authMiddleware = require('./middleware/auth.middleware');
const startup = require('./services/startup.services');
const db = require('./models');
const cors = require('cors');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

connectMongo();
const PORT = process.env.PORT || 8080;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense-Flow API',
      version: '1.0.0',
    }, 
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());  
app.use(express.json())

app.use('/user', require('./routes/user.routes'));
app.use(authMiddleware);
app.use('/refund', require('./routes/refund.routes'));
app.use('/project', require('./routes/project.routes'));

async function startAPI(){
  await db.sequelize.sync()
  await startup.generateAdmin();
  app.listen(PORT, ()=>console.log(`Server running on https://localhost:${PORT}`));
}

startAPI();

