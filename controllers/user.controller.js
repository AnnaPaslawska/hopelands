const db = require('../models');

const User = db.user;

exports.getAll = (req, res) => {
    User.find({})
        .exec((error, user) => {
            if (error) {
                res.status(500).json({ auth: false, message: error });
                return;
            }

            if (!user) {
                return res.status(404).json({ auth: false, message: 'Users not found.' });
            }

            res.status(200).json(user);
        });
};