const express = require('express');

const app = express();
const https = require('http');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');

const { check, validationResult } = require('express-validator');
require('dotenv').config();

const logging = require('./helpers/logging');
const homeRouter = require('./routes/home');
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24
		}
	})
);
const NAMESPACE = 'APP';



const mongoString = process.env.MONGO_CON;
const serverPort = process.env.SERVER_PORT;

/** Connect to MongoDB */
mongoose
	.connect(mongoString)
	.then((result) => {
		logging.info(NAMESPACE, 'MongoDB connection', 'Connected to mongoDB!');
		console.log('Connected to mongoDB!');
		app.listen(serverPort, () => {
			console.log(`Server Started at localhost:${serverPort}`);
		});
	})
	.catch((error) => {
		logging.error(NAMESPACE, 'MongoDB connection', error);
	});

//middlewares
app.use(bodyParser.json());

const corsOpts = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type']
};

app.use(cors(corsOpts));
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname + '/assets/')));
app.set('views', [path.join(__dirname + '/views/'), path.join(__dirname + '/views/home/')]);

app.use(cookieParser());


app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (req.method == 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
		return res.status(200).json({});
	}

	next();
});

//** Pass Session variables to views */
app.use(function (req, res, next) {
	//setiing the Global variable here
	if (req.session.loggedInUser) {
		res.locals.sideMenu = req.session.sideMenu;
		res.locals.user = req.session.loggedInUser;
	}
	next();
});

//Routes
app.use('/', homeRouter);
// app.use('/admin', adminRouter);

/** Error Handling */
app.use((req, res, next) => {
	const error = new Error('Bad Request');

	return res.status(404).json({
		statusCode: 404,
		message: error.message
	});
});
