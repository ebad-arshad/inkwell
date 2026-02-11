import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

import Bookmark from '../models/Bookmark.js';

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
router.get('/bookmarks', protect, async (req, res) => {
    try {
        const bookmarks = await Bookmark.aggregate([
            { $match: { user: req.user._id } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'post',
                    foreignField: '_id',
                    as: 'post'
                }
            },
            { $unwind: '$post' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'post.user',
                    foreignField: '_id',
                    as: 'post.user'
                }
            },
            { $unwind: '$post.user' },
            {
                $lookup: {
                    from: 'likes',
                    localField: 'post._id',
                    foreignField: 'post',
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'post._id',
                    foreignField: 'post',
                    as: 'comments'
                }
            },
            {
                $addFields: {
                    'post.likesCount': { $size: '$likes' },
                    'post.commentsCount': { $size: '$comments' },
                    'post.isLiked': { $in: [req.user._id, '$likes.user'] }
                }
            },
            {
                $project: {
                    _id: '$post._id',
                    title: '$post.title',
                    content: '$post.content',
                    imageUrl: '$post.imageUrl',
                    createdAt: '$post.createdAt',
                    likesCount: '$post.likesCount',
                    isLiked: '$post.isLiked',
                    commentsCount: '$post.commentsCount',
                    user: {
                        _id: '$post.user._id',
                        username: '$post.user.username',
                        fullName: '$post.user.fullName',
                        avatarUrl: '$post.user.avatarUrl'
                    }
                }
            }
        ]);

        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.bio = req.body.bio || user.bio;
            user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                bio: updatedUser.bio,
                avatarUrl: updatedUser.avatarUrl,
                token: req.headers.authorization.split(' ')[1] // return existing token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
