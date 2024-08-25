require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());
console.log(process.env.MONGO_ATLAS);

// Connect to MongoDB
mongoose.connect("mongodb+srv://sushantkeshri2603:susu1213@cluster0.xldfk.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Schema and Model
const bookingSchema = new mongoose.Schema({
    location: String,
    date: String,
    time: String,
    booked: Boolean,
});
const Booking = mongoose.model('Booking', bookingSchema);

// Static files
app.use(express.static('public'));

// API Route to book a slot
app.post('/api/book-slot', async (req, res) => {
    const { location, date, time } = req.body;

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({ location, date, time });
    if (existingBooking) {
        return res.json({ message: 'Slot is already booked!' });
    }

    // Create a new booking
    const newBooking = new Booking({ location, date, time, booked: true });
    await newBooking.save();

    res.json({ message: 'Slot successfully booked!' });
});

const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/api/viewBookings', async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

app.get('/view-bookings', (req, res) => {
    res.sendFile(__dirname + '/public/viewBooking.html');
});

