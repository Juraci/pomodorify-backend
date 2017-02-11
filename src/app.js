import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from './config/config';
import datasource from './config/datasource';
import tasks from './routes/tasks';
import goals from './routes/goals';
import users from './routes/users';

const app = express();
const jsonParser = bodyParser.json();

app.use(cors(config.corsOptions));
app.use(morgan('tiny'));
app.config = config;
app.datasource = datasource(app);

app.use('/tasks', tasks({ datasource: app.datasource, jsonParser }));
app.use('/goals', goals({ datasource: app.datasource, jsonParser }));
app.use('/users', users({ datasource: app.datasource, jsonParser }));

export default app;
