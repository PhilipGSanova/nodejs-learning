// Import Express
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// GET method
app.get('/', (req, res) => {
  res.send('Hello World');
});

// POST method
app.post('/fruits', (req, res) => {
  const fruit = req.body.name;
  res.send(`Fruit ${fruit} added successfully!`);
});

// PUT method
app.put('/fruits/:id', (req, res) => {
  const fruitId = req.params.id;
  const fruit = req.body.name;
  res.send(`Fruit with ID ${fruitId} updated to ${fruit}`);
});

// DELETE method
app.delete('/fruits/:id', (req, res) => {
  const fruitId = req.params.id;
  res.send(`Fruit with ID ${fruitId} deleted successfully`);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
