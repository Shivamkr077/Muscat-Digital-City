const express = require('express');
const controller = require('../controllers/homeController');
const {authUser} = require('../helpers/auth')
const router = express.Router();

router.get('/',authUser,controller.Home);
router.get('/login', controller.Login);
router.post('/loginUser', controller.LoginUser);
router.get('/logout', authUser,controller.logout);
router.get('/showRoom', controller.showRoom);
router.get('/renderPage', controller.renderPage)



// router.get('/getRoomData/:hotelId', controller.GetData);

// router.post('/uploadImage', controller.UploadImage);

// router.post('/bookAVenue', controller.BookAVenue);


module.exports = router;