import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import swaggerUI from 'swagger-ui-express'
import swaggerDocument from './swagger.json';
import routes from './route';

config();

const app = express();

//PARSE INCOMING REQUEST DATA (USE BODY PARSER)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api', routes);

// MAKE APP LISTEN TO PORT(env)
app.listen(process.env.PORT, () =>
  console.log(`app is now listening to port ${process.env.PORT}`)
);
