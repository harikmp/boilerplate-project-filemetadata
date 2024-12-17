const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');

const app = express();
require('dotenv').config()

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Multer configuration for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as a buffer
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// HTML form route
app.get('/', (req, res) => {
  res.send(`
    <form enctype="multipart/form-data" method="POST" action="/api/fileanalyse">
      <input id="inputfield" type="file" name="upfile">
      <input id="button" type="submit" value="Upload">
    </form>
  `);
});

// 1. POST /api/fileanalyse - Handle file upload
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  // Access the uploaded file via req.file
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;

  // Respond with file information
  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size, // Size in bytes
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
