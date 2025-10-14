const http = require('http');

const data = JSON.stringify({ username: 'newuser', password: 'newpass123', role: 'vendor', display_name: 'New Vendor' });

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    try {
      console.log('Body:', JSON.parse(body));
    } catch (e) {
      console.log('Body (raw):', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
