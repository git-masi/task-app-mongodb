require('dotenv').config({ path: 'config/.env.test' });

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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


beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});


// Create user
test('Should create new user', async () => {
  const response = await request(app).post('/users').send({
    "name": "New User From Test",
    "age": 26,
    "email": "newUser@example.com",
    "password": "superSafe"
  }).expect(201);

  const user = await User.findById(response.body.user._id);
  // Expect user is in database
  expect(user).not.toBeNull();

  // Expect user in database has certain properties
  expect(response.body).toMatchObject({
    user: {
      name: 'New User From Test',
      age: 26
    },
    token: user.tokens[0].token
  })
});


// Login user
test('Should login user', async () => {
  const response = await request(app).post('/users/login').send({
    "email": userOne.email,
    "password": userOne.password
  }).expect(200);

  const user = await User.findById(response.body.user._id);

  // Expect token in response to match user's 2nd token in database
  expect(response.body.token).toBe(user.tokens[1].token);
});


// Do not login user
test('Should not login nonexistant user', async () => {
  await request(app).post('/users/login').send({
    "email": "notAUser@fakemail.com",
    "password": "badPass1234"
  }).expect(400);
});


// Do not read user profile
test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', 'Bearer thisIsAFakeToken1234')
    .send()
    .expect(401)
});


// Read user profile
test('Should get user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});


// Do not update user profile
test('Should not update profile for unauthenticated user', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', 'Bearer thisIsAFakeToken1234')
    .send({
      "name": "Robert"
    })
    .expect(401)
});


// Update user profile
test('Should update user profile', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      "name": "Robert"
    })
    .expect(200)
});

// Do not delete user profile
test('Should not delete unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', 'Bearer thisIsAFakeToken1234')
    .send()
    .expect(401)
});


// Delete user profile
test('Should delete user profile', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);

  // Expect the user is not longer in database
  expect(user).toBeNull();
});