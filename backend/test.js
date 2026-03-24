const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  const baseURL = 'http://localhost:3000';

  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Health check:', healthResponse.data);

    // Test 404 endpoint
    console.log('\nTesting 404 endpoint...');
    try {
      const notFoundResponse = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/nonexistent',
        method: 'GET'
      });
      console.log('404 Response:', notFoundResponse.status);
    } catch (error) {
      console.log('404 Error:', error.message);
    }

    console.log('\nAPI server is working correctly!');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPI();