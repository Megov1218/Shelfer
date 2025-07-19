const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addProduct, getAllProducts } = require('../controllers/productController');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Unique filename with timestamp
  }
});

const upload = multer({ storage });

// Routes
// POST route to add a product with an image
router.post('/add', upload.single('image'), addProduct);

// GET route to retrieve all products
router.get('/', getAllProducts);

module.exports = router;
