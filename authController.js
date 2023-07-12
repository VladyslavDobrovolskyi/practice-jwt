const { secret } = require('./config')

const User = require('./models/User')
const Role = require('./models/Role')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  }
  return jwt.sign(payload, secret, { expiresIn: '15s' })
}

class authController {
  async registation(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Ошибка при регистарции', errors })
      }
      const { username, password } = req.body
      const candidate = await User.findOne({ username })

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Пользователь с таким username уже существует' })
      }
      const hashPassword = bcrypt.hashSync(password, 4)
      const userRole = await Role.findOne({ value: 'USER' })
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      })
      await user.save()
      return res
        .status(200)
        .json({ message: 'Пользователь успешно зарегестрирован' })
    } catch (error) {
      res.status(400).json({ message: 'registation Error' })
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }
      const validPassword = bcrypt.compareSync(password, user.password)

      if (!validPassword) {
        return res.status(400).json({ message: 'Пароль неверный' })
      }
      const token = generateAccessToken(user._id, user.roles)

      return res.status(200).json({ token })
    } catch (error) {
      res.status(400).json({ message: 'login Error' })
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()

      if (!users) {
        res.status(400).json({ message: 'Пользователей нет' })
      }
      res.status(200).json({ users })
    } catch (error) {
      res.status(400).json({ message: 'getUsers Error' })
    }
  }
}

module.exports = new authController()
