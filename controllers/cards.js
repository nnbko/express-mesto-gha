/* eslint-disable eol-last */
const Card = require('../models/card');
const ErrorNotFound = require('../constants/ErorrNotFound');
const ErrorServer = require('../constants/ErrorServer');
const ErrorBadRequest = require('../constants/ErrorBadRequest');
const ErrorForbidden = require('../constants/ErrorForbidden');

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => { res.send({ data: cards }); })
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorNotFound('Карточка не найдена'));
      }
      return next(new ErrorServer('На сервере произошла ошибка'));
    });
};
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена'));
        return;
      }
      if (card.owner.toString() !== userId) {
        next(new ErrorForbidden('Вы не можете удалить эту карточку'));
        return;
      }
      Card.findByIdAndDelete(cardId)
        .then(() => {
          res.status(200).send({ data: card });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Неккорктный ID'));
        return;
      }
      next(err);
    });
};
module.exports.addLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ErrorNotFound('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorBadRequest('Неккорктный ID'));
      }
      return next(new ErrorServer('На сервере произошла ошибка'));
    });
};
module.exports.removeLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ErrorNotFound('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Неккорктный ID'));
        return;
      }

      next(err);
    });
};