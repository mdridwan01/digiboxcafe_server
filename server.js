const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const connectDB = require('./config/db');

dotenv.config();
const allowedOrigins = [process.env.CLIENT_ORIGIN];
const applicationUrl =  "https://digiboxcafe.vercel.app";

const app = express();
app.use(cors({
  origin: applicationUrl,
  credentials: true,
}));


app.use(express.json());
app.use(body_parser.json());

connectDB();

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/vending', require('./routes/vendingRoutes'));
app.use('/api', require('./routes/bkashRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
