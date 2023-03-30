const { uploadFile } = require('../helpers/awsHelper');
var formidable = require('formidable');
const logging = require('../helpers/logging');

const axios = require('axios');
const { response } = require('express');

const NAMESPACE = 'HOME Controller';

//** Route Handlers aka actionMethods */
const Home = async (req, res) => {
	logging.info(NAMESPACE, 'Home', 'Inside home');
	res.render('index');
};

const Login = async (req, res) => {
	logging.info(NAMESPACE, 'Home', 'Inside Login');
	res.render('login');
};




const LoginUser = async (req, res)=>{
    const { email, password } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/login', { email, password});
		// console.log(response);
		if(response.data.message){
			var {message}=response.data;
			res.json({message})
		}
		else{
        const { accessToken, href } = response.data;
		req.session.accessToken = accessToken;
        res.json({ href });}
    } catch (error) {
        // console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

const logout = async(req, res)=>{	
	
	req.session.destroy();
	res.redirect('/login');
}

const showRoom = async(req,res)=>{
	try{
		// console.log("in showroom")
		var token = req.session.accessToken;
		console.log("token in showRoom", token);
		let roomId = req.query.roomId;
		console.log("roomId", roomId);
		await axios.post(`http://localhost:3000/showRoomById`,{token:token, roomId:roomId}).then((response) => {
			console.log(response);
			if(response.data.message=="all ok")
			res.redirect(response.config.url)
		  });
		  
		//   await axios.get(`http://localhost:3000/showRoomById?roomId=${roomId}&token=${token}`).then((response) => {
		// 		 console.log(response);
		// 	 	res.redirect(response.config.url);
		//   });
		

	 } catch (error) {
        console.log(error);
    }
}

const renderPage = async(req, res)=>{
	try{
		res.render('indexsample',);
	}
	catch(err){
		console.log(err);
	}
}

module.exports = { Home,Login,LoginUser,logout,showRoom,renderPage };
