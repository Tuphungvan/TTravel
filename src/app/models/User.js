const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: false,
    maxlength: 20
  },
  address: {
    type: String,
    required: false,
    maxlength: 200
  },
  admin: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true // Mặc định tài khoản được kích hoạt
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
