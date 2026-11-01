const test = require('node:test');
const assert = require('node:assert/strict');
const { getMessage } = require('./app');

test('application returns the expected welcome message', () => {
  assert.equal(getMessage(), 'Hello from the Exp-13 CI/CD application!');
});
