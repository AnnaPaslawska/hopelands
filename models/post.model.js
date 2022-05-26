const mongoose = require('mongoose');

const Post = mongoose.model(
    'Post',
    new mongoose.Schema({
        timestamp: Number,
        username: String,
        message: String,
        session: {
            type: mongoose.Types.ObjectId,
            ref: 'Session'
        }
    })
);

module.exports = Post;