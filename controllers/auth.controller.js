const db = require('../models');
const config = require('../config/auth.config');
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'login_account': {
      return [
        body('email').notEmpty().trim().withMessage('Email not empty').isEmail().withMessage('Please enter your email'),
        body('password').notEmpty().withMessage('Password not empty'),
      ];
    }
    case 'register_account': {
      return [
        body('email')
          .notEmpty()
          .trim()
          .withMessage('Email not empty')
          .isEmail()
          .withMessage('Please enter your email')
          .custom(async (email) => {
            let exists = await User.findOne({
              where: {
                email: email,
              },
            });
            if (!exists) {
              return Promise.resolve();
            }
            return Promise.reject('Email is exists');
          }),
        body('password').notEmpty().withMessage('Password not empty'),
      ];
    }
  }
};

exports.signUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let validate = validationResult(req);
  if (!validate.isEmpty()) {
    return res.status(422).jsonp(validate.array());
  }
  User.create({
    email: email,
    password: bcrypt.hashSync(password, 8),
  }).then((user) => {
    res.send({
      message: 'Success',
    });
  });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let validate = validationResult(req);
  if (!validate.isEmpty()) {
    return res.status(422).jsonp(validate.array());
  }

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(404).send({
          message: 'Invalid password',
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });
      return res.status(200).send({
        id: user.id,
        email: user.email,
        accessToken: token,
      });
    })
    .catch(function (err) {
      return res.status(500).send({
        message: err.message,
      });
    });
};

exports.getUserInfo = (req, res) => {
  const userId = req.userId;
  User.findOne({
    where: {
      id: userId,
    },
    include: ['tasks'],
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: 'User not found',
      });
    }
    return res.status(200).send({
      message: 'User successfully',
      data: user,
    });
  });
};
