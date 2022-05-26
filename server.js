'use strict';
const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieSession = require('cookie-session');
const db = require('./models');
const dbConfig = require('./config/db.config');
const dotenv = require('dotenv');

const staticPath = path.join(__dirname, '/');
const port = process.env.PORT || 8080;
const corsOptions = { origin: `http://localhost:${port}` };
const Role = db.role;
const Post = db.post;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

dotenv.config();

app.use(express.static(staticPath));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
	name: 'hopelands-session',
	secret: process.env.JWT_SECRET,
	httpOnly: true
}));

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app, staticPath);
require('./routes/post.routes')(app, staticPath);
require('./routes/session.routes')(app, staticPath);

app.set('port', port);

db.mongoose
	.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Successfully connected to MongoDB.');
		initial();
	})
	.catch(error => {
		console.error('Connection error', error);
		process.exit();
	});

function initial() {
	Role.estimatedDocumentCount((error, count) => {
		if (!error && count === 0) {
			new Role({
				name: 'player'
			}).save(error => {
				if (error) {
					console.log('Error adding player:', error);
				}

				console.log('Added "player" to roles collection.');
			});

			new Role({
				name: 'mg'
			}).save(error => {
				if (error) {
					console.log('Error adding mg:', error);
				}

				console.log('Added "mg" to roles collection.');
			});

			new Role({
				name: 'admin'
			}).save(error => {
				if (error) {
					console.log('Error adding admin:', error);
				}

				console.log('Added "admin" to roles collection.');
            });
        }
    });
}

io.on('connection', socket => {
	console.log('User connected');

	socket.on('hplns-chat-message', msg => {
		new Post(msg).save(error => {
			if (error) {
				console.log('Error saving post:', error);
			}
        });

		io.emit('hplns-chat-message', msg);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});