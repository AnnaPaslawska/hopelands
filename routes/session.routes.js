const { authJwt } = require('../middlewares');
const controller = require('../controllers/session.controller');

module.exports = function (app, staticPath) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, Content-Type, Accept'
        );

        next();
    });

    app.post('/api/session/getAllUserSessions', authJwt.verifyToken, controller.getAllUserSessions);
    app.post('/api/session/get', authJwt.verifyToken, controller.get);
    app.post('/api/session/add', authJwt.verifyToken, controller.add);
    app.post('/api/session/remove', authJwt.verifyToken, controller.remove);
};