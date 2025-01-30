const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { signupValidator, loginValidator } = require('../middleware/validators');

const router = express.Router();

router.post('/signup', signupValidator, AuthController.signup);
router.post('/login', loginValidator, AuthController.login);

module.exports = router; 