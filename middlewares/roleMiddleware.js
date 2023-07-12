const { secret } = require('../config')
const jwt = require('jsonwebtoken')

module.exports = roles => {
  return (module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') next()

    try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res
          .status(403)
          .json({ message: 'Пользователь не авторизирован' })
      }
      const { roles: userRoles } = jwt.verify(token, secret)

      let hasRole = false

      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true
        }
      })

      if (!hasRole) {
        return res
          .status(403)
          .json({ message: 'Недостаточно прав для операции' })
      }
      next()
    } catch (error) {
      return res.status(403).json({ message: 'Пользователь не авторизирован' })
    }
  })
}
