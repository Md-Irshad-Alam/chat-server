const express = require('express');
const {register, login} = require('../Auth/auth.cotrolar');
const app = express();
const router = express.Router();

router.post('/register', register);
router.post('/login', login)

module.exports = router;