const express = require('express');
const { body, validationResult } = require('express-validator');  
const Category = require('../models/Category');

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      message: "Categories fetched successfully",
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    });
  }
});

// POST create new category
router.post('/', body("name").notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const newCat = new Category(req.body);
  await newCat.save();
  res.status(201).json(newCat);
});


// ✅ NEW ROUTE: Add default categories
router.get('/add-defaults', async (req, res) => {
  try {
    const defaultCategories = [
      { name: "Technology", slug: "technology" },
      { name: "Health & Wellness", slug: "health" },
      { name: "Travel", slug: "travel" },
      { name: "Food", slug: "food" },
      { name: "Education", slug: "education" },
      { name: "Sports", slug: "sports" },
      { name: "Entertainment", slug: "entertainment" },
      { name: "Lifestyle", slug: "lifestyle" },
      { name: "Finance", slug: "finance" },
    ];

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }

    res.json({ success: true, message: "Default categories added!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
