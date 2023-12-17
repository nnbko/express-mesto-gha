const router = require('express').Router();
const { validate_CreateCard, validate_CardId } = require('../middlewares/validation');

const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validate_CreateCard, createCard);
router.delete('/:cardId', validate_CardId, deleteCard);
router.put('/:cardId/likes', validate_CardId, addLike);
router.delete('/:cardId/likes', validate_CardId, removeLike);

module.exports = router;