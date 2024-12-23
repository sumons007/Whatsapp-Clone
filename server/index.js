import https from 'https'; 
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import Connection from './database/db.js';
import Routes from './routes/Routes.js';

dotenv.config();
const app = express();

// Use environment variable for PORT
const PORT = process.env.PORT || 8000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// Database connection
Connection(username, password);

// Middleware
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Routes);

// Enable HTTPS if using certificates
const server = app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));

// If you need to enforce HTTPS with certificates locally:
// const server = https.createServer({
//     key: fs.readFileSync('path/to/your/ssl-key.pem'),
//     cert: fs.readFileSync('path/to/your/ssl-cert.pem')
// }, app);

// server.listen(PORT, () => console.log(`Server running on HTTPS PORT ${PORT}`));
