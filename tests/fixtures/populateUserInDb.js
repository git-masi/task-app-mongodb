require('dotenv').config({ path: 'config/.env.test' });

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/User');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  "_id": userOneId,
  "name": "Bob",
  "age": 25,
  "email": "bob@example.com",
  "password": "superSafe",
  "tokens": [{
    "token": jwt.sign({ _id: userOneId }, process.env.PRIVATE_KEY)
  }]
}

const populateUser = async () => {
  await User.deleteMany();
  await new User(userOne).save();
}

module.exports = {
  userOneId,
  userOne,
  populateUser
}