const Card = require('../models/card');
const { STATUS_CODE_CREATED, STATUS_CODE_BAD_REQUEST, STATUS_CODE_NOT_FOUND, STATUS_CODE_SERVER_ERROR } = require('../constants/constants')


module.exports.getCards = (req, res) => {
    Card.find()
        .then((cards) => { res.send({ data: cards }); })
        .catch(() => res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    const owner = req.user._id;

    Card.create({ name, link, owner })
        .then((card) => res.status(STATUS_CODE_CREATED).send({ data: card }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(STATUS_CODE_BAD_REQUEST).send({ message: "Неккоректные данные" });
            } else {
                res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
            }
        });
};
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
    Card.findByIdAndDelete(cardId)
        .then((card) => {
            if (!card) {
                return res.status(STATUS_CODE_NOT_FOUND).send({ message: `Карточка не найдена.` });
            }
            return res.send({ message: `Карточка удалена` });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Неккорктный ID' });
                return;
            }
            res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
                return res.status(STATUS_CODE_NOT_FOUND).send({ message: `Карточка не найдена.` });
            }
            return res.send({ data: card });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Неккорктный ID' });
                return;
            }
            res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
                return res.status(STATUS_CODE_NOT_FOUND).send({ message: `Карточка не найдена.` });
            }
            return res.send({ data: card });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Неккорктный ID' });
                return;
            }
            res.status(STATUS_CODE_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        });
};

