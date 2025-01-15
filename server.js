const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Assessment = require('./models/Assessment');

// Set up Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection URI (replace with your MongoDB URI)
const dbURI = 'mongodb://localhost:27017/manovikasDB'; // For local MongoDB
// const dbURI = 'your_mongodb_atlas_connection_uri'; // For MongoDB Atlas

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// User Registration Route
app.post('/auth/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User Login Route
app.post('/auth/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email, role });
        if (!user) return res.status(400).json({ message: 'Invalid email or role' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Save Assessment Data Route
app.post('/assessment/save', async (req, res) => {
    const { userId, domainScores, totalScore, percentage } = req.body;

    try {
        // Save assessment data
        const assessment = new Assessment({ userId, domainScores, totalScore, percentage });
        await assessment.save();

        res.status(201).json({ message: 'Assessment saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving assessment', error });
    }
});

// Fetch Assessment Results Route
app.get('/assessment/result', async (req, res) => {
    const userId = req.query.userId; // Retrieve userId from query string

    try {
        const assessment = await Assessment.findOne({ userId }).populate('userId');
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

        res.status(200).json(assessment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assessment', error });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});