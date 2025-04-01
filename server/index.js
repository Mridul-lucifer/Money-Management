const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI (replace with your actual MongoDB URI)
const mongoURI = "mongodb+srv://mridul4332:QNNDMvzlMraGJ9qI@cluster0.sr67g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// Define the Payment model
const paymentSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Added title field
  amount: { type: Number, required: true },
  type: { type: String, enum: ['add', 'subtract'], required: true }, // 'add' or 'subtract'
});

const Payment = mongoose.model('Payment', paymentSchema);

// API Routes

// 1. Get all payment records
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (err) {
    res.status(400).json({ message: "Error fetching payments", error: err });
  }
});

// 2. Add a new payment record
app.post('/api/payments', async (req, res) => {
  try {
    const { title, amount, type } = req.body; // Expecting title in the request body
    const newPayment = new Payment({ title, amount, type });
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: "Error adding payment", error: err });
  }
});

// 3. Edit a payment record (by ID)
app.put('/api/payments/:id', async (req, res) => {
  try {
    const { title, amount, type } = req.body; // Expecting title in the request body for update
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { title, amount, type },
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(updatedPayment);
  } catch (err) {
    res.status(400).json({ message: "Error editing payment", error: err });
  }
});

// 4. Delete a payment record (optional)
app.delete('/api/payments/:id', async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting payment", error: err });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});