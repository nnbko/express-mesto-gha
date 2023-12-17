/* eslint-disable eol-last */
const router = require('express').Router();
const { validateCreateCard, validateCardId } = require('../utils/validation');

const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, addLike);
router.delete('/:cardId/likes', validateCardId, removeLike);

module.exports = router;