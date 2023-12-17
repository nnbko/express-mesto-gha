/* eslint-disable eol-last */
const router = require('express').Router();
const { validateUserId, validateUpadteUser, validateUpdateAvatar } = require('../utils/validation');
const {
  getUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpadteUser, updateUserData);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;