import express from 'express';
import { upload } from './uploadMiddleware.js'; // Adjust path as needed

const app = express();

// Single file upload (field name in the HTML form must be "file")
app.post('/upload-single', upload.single('file'), (req, res) => {
  // req.file contains information about the uploaded file
  res.send(`File uploaded successfully: ${req.file.path}`);
});

// Multiple file upload (up to 5 files with field name "photos")
app.post('/upload-multiple', upload.array('photos', 5), (req, res) => {
  // req.files contains an array of uploaded files
  res.send(`${req.files.length} files uploaded successfully`);
});