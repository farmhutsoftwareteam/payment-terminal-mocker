const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.post('/cgi-bin/vol/transaction', (req, res) => {
  console.log('Received transaction request:', req.body);

  let responseFile;
  if (req.body.header.transaction === 'commTest') {
    responseFile = 'commTestResponse.json';
    sendResponse(res, responseFile);
  } else if (req.body.header.transaction === 'sale') {
    responseFile = 'paymentResponse.json';
    setTimeout(() => sendResponse(res, responseFile, req.body.data.amount), 3000);
  } else if (req.body.header.transaction === 'refund') {
    responseFile = 'refundResponse.json';
    setTimeout(() => sendResponse(res, responseFile, req.body.data.amount), 3000);
  } else {
    return res.status(400).json({ error: 'Unsupported transaction type' });
  }
});

function sendResponse(res, responseFile, amount) {
  let response = fs.readFileSync(path.join(__dirname, 'data', responseFile), 'utf-8');
  response = JSON.parse(response);

  if (responseFile === 'paymentResponse.json' || responseFile === 'refundResponse.json') {
    response.data.transactionId = Math.floor(Math.random() * 10000000000).toString();
    response.data.amount = amount;
    response.data.transactionDate = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    response.data.transactionTime = new Date().toTimeString().slice(0, 6);
  }

  res.json(response);
  console.log(`Response sent for ${responseFile} at ${new Date().toISOString()}`);
}

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});