const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  // , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
