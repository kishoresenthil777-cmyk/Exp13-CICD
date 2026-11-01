const http = require('http');

function getMessage() {
  return 'Hello from the Exp-13 CI/CD application!';
}

if (require.main === module) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(getMessage());
  });
  server.listen(3000, '0.0.0.0', () => {
    console.log('App listening on port 3000');
  });
}

module.exports = { getMessage };
