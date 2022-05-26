const mongoose = require('mongoose');

const SessionPlayer = mongoose.model(
    'SessionPlayer',
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

module.exports = SessionPlayer;