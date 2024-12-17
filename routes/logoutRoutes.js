const express = require('express');
const routes = express.Router();
const logout = require('../controllers/logOutController');
const authMiddleware = require('../middleware/authMiddleware');

routes.get('/', authMiddleware, logout);

module.exports = routes;