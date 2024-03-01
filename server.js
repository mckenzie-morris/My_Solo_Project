const express = require('express');
const mongoose = require('mongoose');
const Exercise = require('./models/exerciseModel');
const URI = process.env.MONGO_URI;
const app = express();

app.use(express.json());

// Handles requests to root
app.get('/', (req, res) => {
  res.send('This is the root URL');
});
//
// Handle post request for saving data into database
app.post('/exercises', async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(200).json(exercise);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Handle get request for grabbing all entries from database
app.get('/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find({});
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle get request for grabbing specific exercises from database
app.get('/exercises/:exName', async (req, res) => {
  try {
    const { exName } = req.params;
    const exercise = await Exercise.find({ name: exName });
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle get request for grabbing specific exercises on specific dates from database
app.get('/exercises/:exName/:exDate', async (req, res) => {
  try {
    const { exName, exDate } = req.params;
    const exercise = await Exercise.find({ name: exName, date: exDate });
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle delete request to delete value in database
app.delete('/exercises/:exName/:exDate', async (req, res) => {
  try {
    const { exName, exDate } = req.params;
    const exercise = await Exercise.findOneAndDelete({
      name: exName,
      date: exDate,
    });
    if (!exercise) {
      return res
        .status(404)
        .json({ message: `cannot find exercise: ${exName}` });
    }
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// connect to mongoose database, log successful connection
mongoose
  .connect(URI)
  .then(() => {
    console.log('connected to MongoDB!');
    // app starts a server and listens on port 3000 for connections
    app.listen(3000, () => {
      console.log('Node API app is running on port 3000!');
    });
  })
  .catch((error) => {
    console.log(error);
  });
