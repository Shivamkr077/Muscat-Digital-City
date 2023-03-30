const express = require('express');
const router = express.Router()

const controller = require('../controllers/loginController');


router.post('/login', controller.login);
router.post('/signUp', controller.signup);
router.get('/getRooms', controller.getRooms);
router.post('/showRoomById', controller.showRoomById);
router.get('/showRoomById', controller.getRoomById);
router.get('/renderroom', controller.renderroom)
module.exports = router;

