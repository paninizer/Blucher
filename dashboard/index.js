require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Running on Port ${PORT}`);