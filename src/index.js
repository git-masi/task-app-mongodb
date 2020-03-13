const express = require('express');
const chalk = require('chalk');

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/Task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res, next) => {
  const user = new User(req.body);

  user.save()
    .then(() => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

app.post('/tasks', (req, res, next) => {
  const task = new Task(req.body);

  task.save()
    .then(() => {
      res.send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.use('/', (req, res, next) => {
  res.send('<h1>It\'s alive!</h1>')
});

app.listen(port, () => {
  console.log('Server running');
  console.log(chalk.blue(`http://127.0.0.1:${port}`));
})