const config = require('../config/auth.config');
const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = db.user;
const Role = db.role;

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((error, user) => {
        if (error) {
            res.status(500).json({ message: error });
            return;
        }

        if (req.body.roles) {
            Role.find({
                name: { $in: req.body.roles }
            }, (error, roles) => {
                if (error) {
                    res.status(500).json({ message: error });
                    return;
                }

                user.roles = roles.map(role => role._id);
                user.save(error => {
                    if (error) {
                        res.status(500).json({ message: error });
                        return;
                    }

                    res.send({ message: 'User was registered successfully!' });
                });
            });
        } else {
            Role.findOne({ name: 'player' }, (error, role) => {
                if (error) {
                    res.status(500).json({ message: error });
                    return;
                }

                user.roles = [role._id];
                user.save(error => {
                    if (error) {
                        res.status(500).json({ message: error });
                        return;
                    }

                    res.json({ message: 'User was registered successfully!' });
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
        .populate('roles', '-__v')
        .exec((error, user) => {
            if (error) {
                res.status(500).json({ auth: false, message: error });
                return;
            }

            if (!user) {
                return res.status(404).json({ auth: false, message: 'User not found.' });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).json({ auth: false, message: 'Invalid password!' });
            }

            const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
            const authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
            }

            req.session.token = token;
            res.status(200).json({
                auth: true,
                token: token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities
                }
            });
        });
};

exports.signout = (req, res) => {
    try {
        req.session = null;
        return res.status(200).json({ message: 'You\'ve been signed out!' });
    } catch (error) {
        this.next(error);
    }
};