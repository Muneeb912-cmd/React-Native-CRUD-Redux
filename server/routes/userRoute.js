const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Signup route
router.post('/signup', UserController.signup);

router.post('/update-data', UserController.updateUser);

// Login route
router.post('/login', UserController.login);

router.get('/get-data', UserController.getData);

module.exports = router;
