const { extractTextFromImage, extractDatesSmartly } = require('../utils/ocr');

exports.addProduct = async (req, res) => {
  try {
    const { name, barcode } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const imagePath = req.file ? req.file.path : '';

    let manufactureDate = null;
    let expiryDate = null;

    if (imagePath) {
      const text = await extractTextFromImage(imagePath);
      const dates = extractDatesSmartly(text);

      manufactureDate = dates.manufactureDate ? new Date(dates.manufactureDate) : null;
      expiryDate = dates.expiryDate ? new Date(dates.expiryDate) : null;

      console.log("Extracted OCR Text:\n", text);
      console.log("Smart Detected Dates:", dates);
    }

    const product = new Product({
      name,
      barcode,
      manufactureDate,
      expiryDate,
      imageUrl,
    });

    await product.save();
    res.status(201).json({ message: 'Product added with OCR!', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
