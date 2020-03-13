const express = require('express');
const chalk = require('chalk');

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/Task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/users/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/tasks', async (req, res, next) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.get('/tasks/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.use('/', (req, res, next) => {
  res.send('<h1>It\'s alive!</h1>')
});

app.listen(port, () => {
  console.log('Server running');
  console.log(chalk.blue(`http://127.0.0.1:${port}`));
})