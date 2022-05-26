const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require('./user.model');
db.role = require('./role.model');
db.post = require('./post.model');
db.session = require('./session.model');
db.sessionPlayer = require('./session-player.model');
db.sessionMg = require('./session-mg.model');
db.ROLES = ['admin', 'mg', 'player'];

module.exports = db;