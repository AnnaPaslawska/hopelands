const mongoose = require('mongoose');

const SessionMg = mongoose.model(
    'SessionMg',
    new mongoose.Schema({
        session: {
            type: mongoose.Types.ObjectId,
            ref: 'Session'
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    })
);

module.exports = SessionMg;