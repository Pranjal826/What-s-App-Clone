const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    validate: {
      validator: function (password) {
        return /[A-Z]/.test(password);
      },
      message: 'Password must contain at least one uppercase letter',
    },
  },
  dp: String,
  phone: {
    type: Number,
    unique: true,
  },
});

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;
