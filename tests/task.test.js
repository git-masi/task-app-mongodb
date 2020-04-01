require('dotenv').config({ path: 'config/.env.test' });

const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/Task');
const { userOne, userTwo, taskOne, populateUsers, populateTasks } = require('./fixtures/populateDb');

beforeEach(async () => {
  await populateUsers();
  await populateTasks();
});

// Create task
test('Should create task', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      "description": "Run this test successfully"
    })
    .expect(201)

  const task = await Task.findOne({ "description": "Run this test successfully" });
  // Expect task is in database and default completed = false
  expect(task.completed).toEqual(false);
});


// Get all tasks for userOne
test('Should get tasks for userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  // Expect three tasks
  expect(response.body.length).toEqual(3);
});


// Get one task for userOne
test('Should get task one for userOne', async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  // Expect taskOne match object
  expect(response.body).toMatchObject({
    description: 'task one',
    completed: false
  });
});


// Do not delete task
test('Should not delete tasks if not authenticated', async () => {
  // Expect user will be authenticated but task will not be deleted
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)

  // Expect task is still in database
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});


// Delete task
test('Should delete task', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  // Expect task is not in database
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(404);
});