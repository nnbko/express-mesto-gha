const Card = require('../models/card');
const Error_NotFound = require('../constants/Erorr_NotFound');
const Error_Server = require('../constants/Error_Server');
const Error_BadRequest = require('../constants/Error_BadRequest');
const Error_Forbidden = require('../constants/Error_Forbidden');


module.exports.getCards = (req, res) => {
  Card.find()
    .then((cards) => { res.send({ data: cards }); })
    .catch(next);
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error_NotFound('Карточка не найдена'));
      }
      return next(new Error_Server('На сервере произошла ошибка'));

    });
};
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new Error_BadRequest('Вы не можете удалить эту карточку!'));
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
          if (!card) {
            return next(new Error_Forbidden('Вы не можете удалить эту карточку!'));
          }
          return res.send({ message: `Карточка удалена` });
        })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error_BadRequest('Неккорктный ID'));
      }
      return next(new Error_Server('На сервере произошла ошибка'));
    });
};
module.exports.addLike = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new Error_Forbidden('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error_BadRequest('Неккорктный ID'));
      }
      return next(new Error_Server('На сервере произошла ошибка'));
    });
};

module.exports.removeLike = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new Error_Forbidden('Карточка не найдена.'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error_BadRequest('Неккорктный ID'));
      }
      return next(new Error_Server('На сервере произошла ошибка'));
    });
};

