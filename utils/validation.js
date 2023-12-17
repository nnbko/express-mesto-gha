const { celebrate, Joi } = require('celebrate');

const regex = /^https?:\/\/(www\.)?[a-zA-Z0-9]+([.|-]{1}[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+(\/[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]*#?)?$/;


const validate_CreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
});

const validate_Login = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validate_UpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
});

const validate_UserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const validate_UpadteUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validate_CreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
});

const validate_CardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validate_CreateUser,
  validate_Login,
  validate_UserId,
  validate_UpadteUser,
  validate_UpdateAvatar,
  validate_CreateCard,
  validate_CardId,
};
