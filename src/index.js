const express = require('express');
const chalk = require('chalk');

require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);

app.use(taskRouter);

app.use('/', (req, res, next) => {
  res.status(404).send();
});

app.listen(port, () => {
  console.log('Server running');
  console.log(chalk.blue(`http://127.0.0.1:${port}`));
})