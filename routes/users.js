const router = require('express').Router();
const { validate_UserId, validate_UpadteUser, validate_UpdateAvatar } = require('../utils/validation');
const {
  getUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  getUser
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validate_UserId, getUserById);
router.patch('/me', validate_UpadteUser, updateUserData);
router.patch('/me/avatar', validate_UpdateAvatar, updateUserAvatar);



module.exports = router;