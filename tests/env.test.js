require('dotenv').config({ path: 'config/.env.test' });

test('Make sure env variables are loaded', () => {
  expect(process.env.TEST).toBe('this-is-a-test');
});
