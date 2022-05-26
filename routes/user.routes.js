const { authJwt } = require('../middlewares');
const controller = require('../controllers/user.controller');

module.exports = function (app, staticPath) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, Content-Type, Accept'
        );

        next();
    });

    app.get('/login', (req, res) => {
        res.sendFile(staticPath + '/index.html');
    });

    app.get('/register', (req, res) => {
        res.sendFile(staticPath + '/index.html');
    });

    app.post('/api/user/getAll', authJwt.verifyToken, controller.getAll);

    app.get('*', authJwt.verifyToken, (req, res) => {
        res.sendFile(staticPath + '/index.html');
    });
};