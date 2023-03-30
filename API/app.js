const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const ejs = require("ejs");

const NAMESPACE = 'APP';

app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname + '/assets/')));

app.set('views', [path.join(__dirname + '/views/'), path.join(__dirname + '/views/home/')]);

const mongoString = process.env.MONGO_CON;
const serverPort = process.env.SERVER_PORT;

/** Connect to MongoDB */
mongoose
	.connect(mongoString)
	.then((result) => {
		console.log('Connected to mongoDB!');
		app.listen(serverPort, () => {
			console.log(`Server Started at localhost:${serverPort}`);
		});
	})
	.catch((error) => {
	});
	app.use(express.json())
	const corsOpts = {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type']
	};
	
	app.use(cors(corsOpts));
	app.use(bodyParser.urlencoded({ extended: true }))
	

	const loginRoute = require('./routes/loginRoutes')
	app.use("/", loginRoute)