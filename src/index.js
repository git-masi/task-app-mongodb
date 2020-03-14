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

app.patch('/users/:id', async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'age', 'password', 'email'];
  const isValidUpdate = updates.every(key => allowedUpdates.includes(key));
  if (!isValidUpdate) return res.status(400).send({ "error": "Request contains a feild that cannot be updated"});

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  }
});

app.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
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

app.patch('/tasks/:id', async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidUpdate = updates.every(key => allowedUpdates.includes(key));

  if (!isValidUpdate) return res.status(400).send({ "error": "Request body contains a field that cannot be updated" });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) {
      res.status(404).send();
    } else {
      res.send(task);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  }
});

app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).send();
    } else {
      res.send(task);
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