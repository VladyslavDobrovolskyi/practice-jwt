const { Schema, model } = require('mongoose')

const User = new Schema({
  roles: {
    type: [String],
    ref: 'Role',
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
})

module.exports = model('User', User)
