const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { DiscussionPost, Comment } = require('../models/Discussion');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// GET posts
router.get('/', protect, async (req, res, next) => {
  try {
    const { course, type, page = 1, limit = 10, search } = req.query;
    const query = {};
    if (course) query.course = course;
    if (type) query.type = type;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      DiscussionPost.find(query)
        .populate('author', 'name avatar role')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      DiscussionPost.countDocuments(query),
    ]);
    paginatedResponse(res, posts, page, limit, total);
  } catch (error) { next(error); }
});

// GET single post with comments
router.get('/:id', protect, async (req, res, next) => {
  try {
    const post = await DiscussionPost.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('author', 'name avatar role');

    if (!post) return errorResponse(res, 404, 'Post not found.');

    const comments = await Comment.find({ post: req.params.id, parentComment: null })
      .populate('author', 'name avatar role')
      .sort({ createdAt: 1 });

    successResponse(res, 200, 'Post fetched.', { post, comments });
  } catch (error) { next(error); }
});

// POST create post
router.post('/', protect, async (req, res, next) => {
  try {
    const post = await DiscussionPost.create({ ...req.body, author: req.user._id });
    await post.populate('author', 'name avatar role');
    successResponse(res, 201, 'Post created.', post);
  } catch (error) { next(error); }
});

// POST add comment
router.post('/:id/comments', protect, async (req, res, next) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      post: req.params.id,
      parentComment: req.body.parentComment,
    });
    await comment.populate('author', 'name avatar role');
    successResponse(res, 201, 'Comment added.', comment);
  } catch (error) { next(error); }
});

// PATCH like post
router.patch('/:id/like', protect, async (req, res, next) => {
  try {
    const post = await DiscussionPost.findById(req.params.id);
    if (!post) return errorResponse(res, 404, 'Post not found.');

    const liked = post.likes.includes(req.user._id);
    if (liked) post.likes.pull(req.user._id);
    else post.likes.push(req.user._id);
    await post.save();

    successResponse(res, 200, liked ? 'Unliked.' : 'Liked.', { likes: post.likes.length });
  } catch (error) { next(error); }
});

// PATCH resolve post
router.patch('/:id/resolve', protect, async (req, res, next) => {
  try {
    const post = await DiscussionPost.findByIdAndUpdate(
      req.params.id, { isResolved: true }, { new: true }
    );
    successResponse(res, 200, 'Post marked as resolved.', post);
  } catch (error) { next(error); }
});

module.exports = router;
