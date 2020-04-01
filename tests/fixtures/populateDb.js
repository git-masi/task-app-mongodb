require('dotenv').config({ path: 'config/.env.test' });

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  "_id": userTwoId,
  "name": "Tom",
  "age": 35,
  "email": "Tom@example.com",
  "password": "superSafe1234!",
  "tokens": [{
    "token": jwt.sign({ _id: userTwoId }, process.env.PRIVATE_KEY)
  }]
}

const taskOne = {
  "_id": new mongoose.Types.ObjectId(),
  "description": "task one",
  "completed": false,
  "owner": userOneId
}

const taskTwo = {
  "_id": new mongoose.Types.ObjectId(),
  "description": "task two",
  "completed": true,
  "owner": userOneId
}

const taskThree = {
  "_id": new mongoose.Types.ObjectId(),
  "description": "task three",
  "completed": false,
  "owner": userTwoId
}

const taskFour = {
  "_id": new mongoose.Types.ObjectId(),
  "description": "task four",
  "completed": true,
  "owner": userOneId
}

const taskFive = {
  "_id": new mongoose.Types.ObjectId(),
  "description": "task five",
  "completed": true,
  "owner": userTwoId
}

const populateUsers = async () => {
  try {
    await User.deleteMany();
    await User.create([userOne, userTwo]);
  } catch (err) {
    console.log(err);
  }
}

const populateTasks = async () => {
  try {
    await Task.deleteMany();
    await Task.create([taskOne, taskTwo, taskThree, taskFour, taskFive]);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  populateUsers,
  populateTasks
}