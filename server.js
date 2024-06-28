

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ricemill', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    phoneNumber: String
}, { collection: 'customers' });

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

app.post('/register', async (req, res) => {
    const { firstName, lastName, username, password, email, phoneNumber } = req.body;
    console.log('Received registration data:', req.body); // Log received data
    if (firstName && lastName && username && password && email && phoneNumber) {
        try {
            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists with this email:', email); // Log existing user
                return res.status(400).json({ success: false, message: 'User already exists with this email' });
            }

            const user = new User({ firstName, lastName, username, password, email, phoneNumber });
            await user.save();
            console.log('User saved successfully:', user); // Log the user data
            res.status(201).json({ success: true, message: 'User registered successfully' });
        } catch (error) {
            console.error('Error saving user:', error); // Log error
            res.status(500).json({ success: false, message: 'Error registering user' });
        }
    } else {
        console.warn('Invalid data received:', req.body); // Log invalid data
        res.status(400).json({ success: false, message: 'Invalid data' });
    }
});

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Login attempt:', req.body); // Log login attempt
//     try {
//         const user = await User.findOne({ email, password });
//         if (user) {
//             console.log('Login successful'); // Log success
//             res.json({ success: true });
//         } else {
//             console.log('Invalid email or password'); // Log invalid attempt
//             res.json({ success: false, message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         console.error('Error logging in:', error); // Log error
//         res.status(500).json({ success: false, message: 'Error logging in' });
//     }
// });

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Login attempt:', req.body); // Log login attempt
//     try {
//         const user = await User.findOne({ email, password });
//         if (user) {
//             console.log('Login successful'); // Log success
//             res.json({ success: true, user: { username: user.username, email: user.email } });
//         } else {
//             console.log('Invalid email or password'); // Log invalid attempt
//             res.json({ success: false, message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         console.error('Error logging in:', error); // Log error
//         res.status(500).json({ success: false, message: 'Error logging in' });
//     }
// });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', req.body); // Log login attempt
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            console.log('Login successful'); // Log success
            res.json({ success: true, username: user.username });
        } else {
            console.log('Invalid email or password'); // Log invalid attempt
            res.json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error); // Log error
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});



app.get('/customers', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error); // Log error
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


