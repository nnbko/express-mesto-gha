
const User = require('../models/user');
const { STATUS_CODE_CREATED, STATUS_CODE_BAD_REQUEST, STATUS_CODE_NOT_FOUND, STATUS_CODE_SERVER_ERROR } = require('../constants/constants')

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => { res.send({ data: users }); })
    .catch(() => res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_CODE_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Неккорктный ID' });
        return;
      }
      res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODE_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: "Неккоректные данные" });
      } else {
        res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};




module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: "Неккоректные данные" });
      } else {
        res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;


  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE_BAD_REQUEST).send({ message: "Неккоректные данные" });
      } else {
        res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

