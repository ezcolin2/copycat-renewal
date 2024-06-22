import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  matches: {
    type: Number,
    default: 0
  },
  win: {
    type: Number,
    default: 0
  },
  lose: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

export default User;
