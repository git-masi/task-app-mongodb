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
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

app.get('/users', (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    }).catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/users/:id', (req, res, next) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send();
      }
    }).catch((err) => {
      res.status(500).send(err);
    });
});

app.post('/tasks', (req, res, next) => {
  const task = new Task(req.body);

  task.save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/tasks', (req, res, next) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    }).catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/tasks/:id', (req, res, next) => {
  const _id = req.params.id;

  Task.findById(_id)
    .then((task) => {
      if (task) {
        res.send(task);
      } else {
        res.status(404).send();
      }
    }).catch((err) => {

    });
});

app.use('/', (req, res, next) => {
  res.send('<h1>It\'s alive!</h1>')
});

app.listen(port, () => {
  console.log('Server running');
  console.log(chalk.blue(`http://127.0.0.1:${port}`));
})