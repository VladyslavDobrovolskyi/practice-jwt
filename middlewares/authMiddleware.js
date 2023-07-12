const { secret } = require('../config')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') next()

  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(403).json({ message: 'Пользователь не авторизирован' })
    }
    const decodedData = jwt.verify(token, secret, (err, data) => {
      if (err) {
        return res.status(403).json({ message: 'Упс, что-то не так с токеном' })
      }
      return data
    })
    req.user = decodedData
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Пользователь не авторизирован' })
  }
}
