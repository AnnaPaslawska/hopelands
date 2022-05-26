const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');

const User = db.User;
const Role = db.Role;

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }

        req.userId = decoded.id;

        next();
    });
};

isAdmin = (res, req, next) => {
    User.findById(req.userId).exec((error, user) => {
        if (error) {
            res.status(500).send({ message: error });
            return;
        }

        Role.find({
            _id: { $in: user.roles }
        }, (error, roles) => {
            if (error) {
                res.status(500).send({ message: error });
                return;
            }

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    next();
                    return;
                }
            }

            res.status(403).send({ message: 'Require Admin role!' });
            return;
        });
    });
};

isMg = (res, req, next) => {
    User.findById(req.userId).exec((error, user) => {
        if (error) {
            res.status(500).send({ message: error });
            return;
        }

        Role.find({
            _id: { $in: user.roles }
        }, (error, roles) => {
            if (error) {
                res.status(500).send({ message: error });
                return;
            }

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'mg') {
                    next();
                    return;
                }
            }

            res.status(403).send({ message: 'Require MG role!' });
            return;
        });
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isMg
};

module.exports = authJwt;