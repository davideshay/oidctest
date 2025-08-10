const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APIURL = process.env.APIURL || "/api/test";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Serve the main HTML page
app.get('/', (req, res) => {
  const headers = JSON.stringify(req.headers, null, 2);
  const cookies = JSON.stringify(req.cookies, null, 2);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Headers and Cookies Display</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
            }
            .section { 
                margin: 20px 0; 
                padding: 15px; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
            }
            pre { 
                background: #f5f5f5; 
                padding: 10px; 
                border-radius: 3px; 
                overflow-x: auto;
            }
            button { 
                background: #007bff; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 5px; 
                cursor: pointer; 
                font-size: 16px;
            }
            button:hover { background: #0056b3; }
            #result { 
                margin-top: 20px; 
                padding: 10px; 
                border: 1px solid #ccc; 
                border-radius: 5px; 
                background: #f8f9fa; 
            }
            .hidden { display: none; }
        </style>
    </head>
    <body>
        <h1>Request Headers and Cookies</h1>
        
        <div class="section">
            <h2>Request Headers</h2>
            <pre>${headers}</pre>
        </div>
        
        <div class="section">
            <h2>Cookies</h2>
            <pre>${cookies}</pre>
        </div>
        
        <div class="section">
            <h2>API Test</h2>
            <button onclick="callAPI()">Call API Endpoint</button>
            <div id="result" class="hidden">
                <h3>API Response:</h3>
                <pre id="response-content"></pre>
            </div>
        </div>

        <script>
            async function callAPI() {
                try {
                    const response = await fetch('${APIURL}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Custom-Header': 'test-value'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ message: 'Hello from frontend!' })
                    });
                    
                    const data = await response.json();
                    document.getElementById('response-content').textContent = JSON.stringify(data, null, 2);
                    document.getElementById('result').classList.remove('hidden');
                } catch (error) {
                    document.getElementById('response-content').textContent = 'Error: ' + error.message;
                    document.getElementById('result').classList.remove('hidden');
                }
            }
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

// API endpoint that logs headers and cookies to stdout
app.post('/api/test', (req, res) => {
  console.log('=== API ENDPOINT CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  console.log('\n--- Request Headers ---');
  Object.entries(req.headers).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  
  console.log('\n--- Cookies ---');
  if (Object.keys(req.cookies).length > 0) {
    Object.entries(req.cookies).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } else {
    console.log('No cookies found');
  }
  
  console.log('\n--- Request Body ---');
  console.log(JSON.stringify(req.body, null, 2));
  
  console.log('=== END API CALL ===\n');
  
  // Return response to frontend
  res.json({
    success: true,
    message: 'Headers and cookies logged to server console',
    timestamp: new Date().toISOString(),
    receivedHeaders: req.headers,
    receivedCookies: req.cookies,
    receivedBody: req.body
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
