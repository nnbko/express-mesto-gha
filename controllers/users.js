const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Error_NotFound = require('../constants/Erorr_NotFound');
const Error_Server = require('../constants/Error_Server');
const Error_BadRequest = require('../constants/Error_BadRequest');
const Error_Conflict = require('../constants/Error_Conflict');
const Error_Unauthorized = require('../constants/Error_Unauthorized');

const MONGODB_DUPLICATE_ERROR_CODE = 11000;

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => { res.status(200).send({ data: users }); })
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new Error_NotFound('Запрашиваемый пользователь не найден'));
      }
      res.send(user);
    })
    .catch(next);
};
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new Error_NotFound('Пользователь не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error_BadRequest('Неккорктный ID'));
      }
      return next(new Error_Server('На сервере произошла ошибка'));
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.code === MONGODB_DUPLICATE_ERROR_CODE) {
        return next(new Error_Conflict('Пользователь с такой почтой уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new Error_BadRequest('Переданы некорректные данные '));
      }
      return next(new Error_Server('На сервере произошла ошибка'));
    });
};




module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error_BadRequest('Переданы некорректные данные'));
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;


  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error_BadRequest('Переданы некорректные данные'));
      }
    });
};

module.exports.login = (req, res, next, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new Error_Unauthorized('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })
      res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 360000 });
      res.send({ token });
    })
    .catch(next);
};
