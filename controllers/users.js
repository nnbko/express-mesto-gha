/* eslint-disable eol-last */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorNotFound = require('../constants/ErorrNotFound');
const ErrorServer = require('../constants/ErrorServer');
const ErrorBadRequest = require('../constants/ErrorBadRequest');
const ErrorConflict = require('../constants/ErrorConflict');

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
        next(new ErrorNotFound('Запрашиваемый пользователь не найден'));
        return;
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
        next(new ErrorNotFound('Пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorBadRequest('Неккорктный ID'));
      }
      return next(new ErrorServer('На сервере произошла ошибка'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === MONGODB_DUPLICATE_ERROR_CODE) {
        next(new ErrorConflict('Пользователь с такой почтой уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные '));
        return;
      }
      next(err);
    });
};

module.exports.updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
