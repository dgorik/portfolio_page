const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();

const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(
    cors({
        origin: 'null',
    })
);

// Handle form submission

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

router.get("/success", (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'email_success.html'));
});

router.post('/message', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log('Request body:', req.body);

        // Create a nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME, // Your email address from environment variable
                pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
            },
        });
        console.log('Transporter created');

        let mailOptions = {
            from: `${name} <${email}>`, // Sender name and address
            to: 'dgorbachev06@gmail.com', // Recipient email address
            subject: 'New Portfolio Message', // Email subject
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Email body
        };

        console.log('Mail options:', mailOptions);

        // Send email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Email sent successfully!' })
    } catch (error) {
        console.error('Error occurred:', error);
        // Send error response to client
        res.status(500).json({ error: 'Internal server error. Failed to send email.' });
    }
});

// Convert Express app to a serverless function

app.use('/.netlify/functions/server', router)

module.exports = app;

module.exports.handler = serverless(app)