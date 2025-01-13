const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')


// AIzaSyC4SC6aXQ2L7zAkCTT2g0ky6bWJMtcbTxg


// clientid
// 287540115183-ia19hgvs0lgum4b9ufgkiv30g4d2euoq.apps.googleusercontent.com

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
