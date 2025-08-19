// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fruitsdb';

// Middleware
app.use(express.json());

// ----- Mongoose schema + model -----
const fruitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }
}, { timestamps: true });

const Fruit = mongoose.model('Fruit', fruitSchema);

// ----- Routes -----
app.get('/', (req, res) => {
  res.send('Hello World');
});

// GET all fruits
app.get('/fruits', async (req, res) => {
  try {
    const fruits = await Fruit.find().sort({ createdAt: -1 });
    res.json(fruits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single fruit
app.get('/fruits/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const fruit = await Fruit.findById(id);
    if (!fruit) return res.status(404).json({ message: 'Not found' });
    res.json(fruit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
app.post('/fruits', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });

  try {
    const newFruit = await Fruit.create({ name });
    res.status(201).json(newFruit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
app.put('/fruits/:id', async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  if (!name) return res.status(400).json({ message: 'name is required' });

  try {
    const updated = await Fruit.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/fruits/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const deleted = await Fruit.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- Connect to MongoDB and start server -----
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT: closing MongoDB connection');
  await mongoose.connection.close();
  process.exit(0);
});
