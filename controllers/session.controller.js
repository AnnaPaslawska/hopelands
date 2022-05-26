const db = require('../models');

const Session = db.session;
const SessionPlayer = db.sessionPlayer;
const SessionMg = db.sessionMg;

exports.getAllUserSessions = (req, res) => {
    Session.find({ user: req.body.user })
        .limit(100)
        .exec((error, session) => {
            if (error) {
                res.status(500).json({ auth: false, message: error });
                return;
            }

            if (!session) {
                return res.status(404).json({ auth: false, message: 'Sessions not found.' });
            }

            res.status(200).json(session);
        });
};

exports.get = async (req, res) => {
    const sessionId = req.body.sessionId;
    const session = await Session.findOne({ _id: sessionId });
    const players = await SessionPlayer.find({ session });
    const mgs = await SessionMg.find({ session });

    res.status(200).json({session, players, mgs});
}

exports.add = async (req, res) => {
    const { name, players, mgs } = req.body;

    const session = await new Session({ name }).save();

    const sessionPlayers = players.map(user => {
        return {
            user,
            session
        }
    });
    const sessionMgs = mgs.map(user => {
        return {
            user,
            session
        }
    });

    await SessionPlayer.insertMany(sessionPlayers);
    await SessionMg.insertMany(sessionMgs);

    res.status(200).json(session);
};

exports.edit = async (req, res) => {
    const { _id, name, players, mgs } = req.body;

    const session = await Session.findOneAndUpdate({ _id }, { name }, { new: true });
    const oldPlayers = await SessionPlayer.find({ session });
    const oldMgs = await SessionMg.find({ session });

    res.status(200).json(session);
};

exports.remove = async (req, res) => {
    const session = req.body.session;

    await Session.deleteOne({ _id: session._id });
    await SessionPlayer.deleteMany({ session });
    await SessionMg.deleteMany({ session });

    res.status(200).json({message: 'Session deleted'});
};