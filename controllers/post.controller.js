const db = require('../models');

const Post = db.post;

exports.getAllSessionPosts = (req, res) => {
    Post.find({ session: req.body.session })
        .limit(100)
        .sort('timestamp')
        .exec((error, post) => {
            if (error) {
                res.status(500).json({ auth: false, message: error });
                return;
            }

            if (!post) {
                return res.status(404).json({ auth: false, message: 'Posts not found.' });
            }

            res.status(200).json(post);
        });
};