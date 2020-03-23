const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Task = require('../models/Task');

router.post('/tasks', auth, async (req, res, next) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/tasks', auth, async (req, res, next) => {
  try {
    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);

    // Does the same as above in a slightly more obvious way
    // const tasks = await Task.find({ owner: req.user._id});
    // res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
})

router.get('/tasks/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (task) {
      res.send(task);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/tasks/:id', auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidUpdate = updates.every(key => allowedUpdates.includes(key));

  if (!isValidUpdate) return res.status(400).send({ "error": "Request body contains a field that cannot be updated" });

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (task) {
      updates.forEach(update => task[update] = req.body[update]);
      await task.save();
      res.send(task);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  }
});

router.delete('/tasks/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (task) {
      await task.remove();
      res.send(task);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;