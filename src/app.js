const express = require('express');
const cors = require('cors');

require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const app = express();

app.use(cors());

app.use((req, res, next) => require('./middleware/maintenanceMode')(req, res, next, false));

app.use(express.json());

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.use('/', (req, res, next) => {
  res.status(404).send();
});

module.exports = app;