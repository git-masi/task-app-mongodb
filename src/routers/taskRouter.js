const express = require('express');
const router = express.Router();

const Task = require('../models/Task');

router.post('/tasks', async (req, res, next) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
})

router.get('/tasks/:id', async (req, res, next) => {
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

router.patch('/tasks/:id', async (req, res, next) => {
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

router.delete('/tasks/:id', async (req, res, next) => {
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

module.exports = router;