const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple route to test POST requests
app.post('/test', (req, res) => {
    console.log('Received request:', req.body);
    
    // Respond with a success message and echo the received data
    res.json({
        message: 'Request received successfully!',
        receivedData: req.body
    });
});
// Endpoint to handle commTest
app.post('/cgi-bin/vol/transaction', (req, res) => {
    console.log('Received commTest request:', req.body);

    // Read the mock response from the file
    const response = fs.readFileSync(path.join(__dirname, 'data', 'commTestResponse.json'), 'utf-8');

    // Parse and send the response
    res.json(JSON.parse(response));
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
