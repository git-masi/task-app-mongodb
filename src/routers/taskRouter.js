const express = require('express');
const cors = require('cors');

const router = express.Router();

const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Create new task
router.post('', auth, async (req, res, next) => {
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

// Read all tasks
// Example routes
  // GET /tasks?completed=true
  // GET /tasks?limit=10&skip=20
  // GET /tasks?sortBy=createdAt:desc
router.get('', auth, async (req, res, next) => {
  try {
    const match = {};
    const options = {};
    // sort is an object that is added to options
    const sort = {};

    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }

    if (req.query.limit) {
      options.limit = parseInt(req.query.limit);
      options.skip = parseInt(req.query.skip);
    }

    if (req.query.sortBy) {
      const sortBy = req.query.sortBy.split(':');
      const sortField = sortBy[0];
      const sortOrder = sortBy[1];

      sort[sortField] = sortOrder === 'desc' ? -1 : 1;

      options.sort = sort;
    }

    await req.user.populate({
      'path': 'tasks',
      match,
      options
    }).execPopulate();

    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Read one task
router.get('/:id', auth, async (req, res, next) => {
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

// Update one task
router.patch('/:id', auth, async (req, res, next) => {
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

// enable preflight request
router.options('/:id', cors());

// Delete one task
router.delete('/:id', auth, async (req, res, next) => {
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