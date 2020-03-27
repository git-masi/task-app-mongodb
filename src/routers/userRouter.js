const express = require('express');
const router = express.Router();

var multer = require('multer');

const User = require('../models/User');
const auth = require('../middleware/auth');

// Login user => handle credentials, create JWT for authentication
router.post('/users/login', async (req, res, next) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch (err) {
    res.status(400).send(err);
  }
});

// Logout user => remove one JWT
router.post('/users/logout', auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Logout user => remove all JWT
router.post('/users/logoutAll', auth, async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Create new user
router.post('/users', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/users/me', auth, async (req, res, next) => {
  res.send(req.user);
});

// GET => /users/:id will be deleted in "production"
// Leaving it temporarily for use in development
//
// router.get('/users/:id', async (req, res, next) => {
//   try {
//     const _id = req.params.id;
//     const user = await User.findById(_id);
//     if (user) {
//       res.send(user);
//     } else {
//       res.status(404).send();
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// Update user
router.patch('/users/me', auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'age', 'password', 'email'];
  const isValidUpdate = updates.every(key => allowedUpdates.includes(key));

  if (!isValidUpdate) return res.status(400).send({ "error": "Request contains a feild that cannot be updated" });

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  }
});

// Delete user (User schema handles deleting associated tasks)
router.delete('/users/me', auth, async (req, res, next) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Upload image as user avatar
const upload = multer({
  dest: 'uploads/avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    // For development: prevents the file from being uploaded to the server
    // cb(undefined, false); // Fails silently

    if (file.originalname.search(/\.(jpg|jpeg|png)$/i) !== -1) {
      return cb(undefined, true);
    } else {
      const err = new Error('File must be an image');
      return cb(err);
    }
  }
});

router.post('/users/me/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;