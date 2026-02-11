import express from 'express';
import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import Bookmark from '../models/Bookmark.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public (Optional Auth for likes)
router.get('/', optionalProtect, async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    isLiked: {
                        $in: [userId, '$likes.user']
                    }
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments'
                }
            },
            {
                $addFields: {
                    commentsCount: { $size: '$comments' }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    imageUrl: 1,
                    createdAt: 1,
                    likesCount: 1,
                    isLiked: 1,
                    commentsCount: 1,
                    'user._id': 1,
                    'user.username': 1,
                    'user.fullName': 1,
                    'user.avatarUrl': 1
                }
            }
        ]);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get trending posts
// @route   GET /api/posts/trending
// @access  Public
router.get('/trending', optionalProtect, async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    commentsCount: { $size: '$comments' },
                    isLiked: {
                        $in: [userId, '$likes.user']
                    }
                }
            },
            {
                $sort: { likesCount: -1 }
            },
            {
                $limit: 6 // Top 6
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    imageUrl: 1,
                    createdAt: 1,
                    likesCount: 1,
                    isLiked: 1,
                    commentsCount: 1,
                    'user._id': 1,
                    'user.username': 1,
                    'user.fullName': 1,
                    'user.avatarUrl': 1
                }
            }
        ]);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', optionalProtect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', 'username fullName avatarUrl');

        if (post) {
            // Fetch comments
            const comments = await Comment.find({ post: post._id })
                .populate('user', 'username fullName avatarUrl')
                .sort({ createdAt: -1 });

            // Fetch likes count
            const likesCount = await Like.countDocuments({ post: post._id });

            // Check if current user has liked
            let isLiked = false;
            let isBookmarked = false; // Stub for now, or implement if easy

            if (req.user) {
                const existingLike = await Like.findOne({ user: req.user._id, post: post._id });
                if (existingLike) isLiked = true;

                // Check bookmark too since we are here
                const existingBookmark = await Bookmark.findOne({ user: req.user._id, post: post._id });
                if (existingBookmark) isBookmarked = true;
            }

            res.json({ ...post.toObject(), comments, likesCount, isLiked, isBookmarked });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Create a post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    try {
        const post = new Post({
            user: req.user._id,
            title,
            content,
            imageUrl
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            post.title = title || post.title;
            post.content = content || post.content;
            post.imageUrl = imageUrl || post.imageUrl;

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const existingLike = await Like.findOne({ user: req.user._id, post: post._id });

        if (existingLike) {
            await existingLike.deleteOne();
            res.json({ message: 'Post unliked' });
        } else {
            await Like.create({ user: req.user._id, post: post._id });
            res.json({ message: 'Post liked' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
    const { content } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = await Comment.create({
            user: req.user._id,
            post: post._id,
            content
        });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'username fullName avatarUrl');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Bookmark a post
// @route   POST /api/posts/:id/bookmark
// @access  Private
router.post('/:id/bookmark', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const existingBookmark = await Bookmark.findOne({ user: req.user._id, post: post._id });

        if (existingBookmark) {
            await existingBookmark.deleteOne();
            res.json({ message: 'Post unbookmarked', isBookmarked: false });
        } else {
            await Bookmark.create({ user: req.user._id, post: post._id });
            res.json({ message: 'Post bookmarked', isBookmarked: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a comment
// @route   DELETE /api/posts/:postId/comments/:commentId
// @access  Private
router.delete('/:postId/comments/:commentId', protect, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const comment = await Comment.findById(commentId);
        const post = await Post.findById(postId);

        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Allow if user is comment author OR post author
        if (
            comment.user.toString() !== req.user._id.toString() &&
            post.user.toString() !== req.user._id.toString()
        ) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a comment
// @route   PUT /api/posts/:postId/comments/:commentId
// @access  Private
router.put('/:postId/comments/:commentId', protect, async (req, res) => {
    const { content } = req.body;
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Allow only if user is comment author
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        comment.content = content || comment.content;
        const updatedComment = await comment.save();

        // Populate user for consistent return
        await updatedComment.populate('user', 'username fullName avatarUrl');

        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
