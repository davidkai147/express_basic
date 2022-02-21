const { authJwt } = require('../middleware');
const authController = require('../controllers/auth.controller');

module.exports = (app) => {
  var router = require('express').Router();
  router.post('/signUp', [authController.validate('register_account')], authController.signUp);
  router.post('/login', [authController.validate('login_account')], authController.login);

  // Get user info
  router.get('/getUserInfo', [authJwt.verifyToken], authController.getUserInfo);

  app.use('/api/auth', router);
};
