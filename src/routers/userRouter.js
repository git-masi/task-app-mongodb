const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/users/login', async (req, res, next) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/users/:id', async (req, res, next) => {
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

router.patch('/users/:id', async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'age', 'password', 'email'];
  const isValidUpdate = updates.every(key => allowedUpdates.includes(key));

  if (!isValidUpdate) return res.status(400).send({ "error": "Request contains a feild that cannot be updated" });

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send();
    } else {
      updates.forEach(update => user[update] = req.body[update]);
      await user.save();
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

router.delete('/users/:id', async (req, res, next) => {
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

module.exports = router;