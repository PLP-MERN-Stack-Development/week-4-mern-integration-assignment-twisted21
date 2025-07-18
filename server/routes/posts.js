const express = require('express');
const {body, validationResult} = require('express-validator');
const Post = require('../models/Post');

const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await Post.find().populate("category")
    res.json({
        success: true,
        message: "Posts fetched successfully",
        posts
    });
})

router.get(':id', async (req, res) => {
    const post = await Post.findById(req.params.id).populate("category")
    res.json({
        success: true,
        message: "Post fetched successfully",
        post
    });
})

router.post('/',
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      // TEMP: assign dummy author (replace with actual _id from your users collection)
      const dummyAuthorId = '64b1f7d7a0c1234567890abc'; 
      const newPost = new Post({ ...req.body, author: dummyAuthorId });

      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Post creation failed',
        error: err.message,
      });
    }
});


router.put('/:id', async (req, res) => {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updated);
})

router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: "Post deleted successfully"
    });
})

module.exports = router;