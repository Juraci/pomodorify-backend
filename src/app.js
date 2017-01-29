import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config';
import datasource from './config/datasource';
import tasks from './routes/tasks';
import goals from './routes/goals';
import users from './routes/users';

const app = express();

app.use(cors(config.corsOptions));
app.use(morgan('tiny'));
app.config = config;
app.datasource = datasource(app);

app.use('/tasks', tasks(app.datasource));
app.use('/goals', goals(app.datasource));
app.use('/users', users(app.datasource));

export default app;
