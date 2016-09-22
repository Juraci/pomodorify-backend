import express from 'express';
import cors from 'cors';
import config from './config/config';
import datasource from './config/datasource';
import goals from './routes/goals';

const app = express();

app.use(cors(config.corsOptions));
app.config = config;
app.datasource = datasource(app);

app.use('/goals', goals(app.datasource));


export default app;
