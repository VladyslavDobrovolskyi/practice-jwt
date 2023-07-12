const Router = require('express')
const router = new Router()
const authController = require('./authController')
const authMiddleware = require('./middlewares/authMiddleware')
const roleMiddleware = require('./middlewares/roleMiddleware')
const { check } = require('express-validator')

router.post(
  '/registration',
  [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check(
      'password',
      'Пароль должен быть больше 3 и меньше 18 символов'
    ).isLength(4, 18),
  ],
  authController.registation
)
router.post('/login', authController.login)

router.get(
  '/users',
  [roleMiddleware(['ADMIN', 'USER'])],
  authController.getUsers
)

module.exports = router
