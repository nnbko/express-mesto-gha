/* eslint-disable eol-last */
const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoose = require('mongoose');
const ErrorUnauthorized = require('../constants/ErrorUnauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: validator.isURL,

  },

  email: {
    type: String,
    unique: true,
    required: true,
    validator: validator.isEmai,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorUnauthorized('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrorUnauthorized('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};
module.exports = mongoose.model('user', userSchema);