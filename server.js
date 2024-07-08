const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection to 'groundwater' database
mongoose.connect('mongodb://localhost:27017/groundwater');

// Define a schema named 'WaterSchema'
const WaterSchema = new mongoose.Schema({
    purityLevel: Number,
    depth: Number,
    location: String,
    pHLevel: Number,
    result: String,
    yearsSupply: Number
});

// Define a model named 'Water' based on 'WaterSchema'
// This will create a collection named 'waters' in the 'groundwater' database
const Water = mongoose.model('Water', WaterSchema);

// Route to handle data insertion
app.post('/api/water', async (req, res) => {
    const { purityLevel, depth, location, pHLevel, result, yearsSupply } = req.body;
    const waterData = new Water({
        purityLevel,
        depth,
        location,
        pHLevel,
        result,
        yearsSupply
    });

    try {
        await waterData.save();
        res.status(201).send({ message: 'Data saved successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving data', error });
    }
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Trying another port...`);
        setTimeout(() => {
            server.close();
            app.listen(0, () => {
                const newPort = server.address().port;
                console.log(`Server running at http://localhost:${newPort}`);
            });
        }, 1000);
    } else {
        console.error('Server error:', err);
    }
});
